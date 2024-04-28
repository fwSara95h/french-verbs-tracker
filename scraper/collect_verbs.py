import requests
from bs4 import BeautifulSoup
import json


def linkToSoup(targetUrl, conf={}, isv=True, returnErr=False, returnResp=False):
    bsParser = conf.get('parser', 'html.parser')
    reqArgs = {k: v for k, v in conf.items() if k != 'parser'}
    try:
        # can pass headers/cookies/etc via conf
        r = requests.get(targetUrl, **reqArgs)

        if r.status_code == 200:
            # ####### CAN ADD OTHER CHECKS ####### #
            if isv:
                print(repr(r), '[ parser:', bsParser, '] from', r.url)
            soup = BeautifulSoup(r.content, bsParser)
            return (soup, r) if returnResp else soup

        errMsg = f'<{r.status_code} {r.reason}> - '
        errMsg = f'{errMsg}Failed to scrape {targetUrl}'
    except Exception as e:
        errMsg = f'Failed to scrape {targetUrl} \n - errorMsg: "{str(e)}"'
    if isv:
        print(errMsg)

    ret1 = errMsg if returnErr else None
    return (ret1, r) if returnResp else ret1


rootUrl = 'https://leconjugueur.lefigaro.fr'
fSoup = linkToSoup(f'{rootUrl}/frlistedeverbe.php')

vLinks = {a.get_text(' ', strip=True): {
    'meaning': '', 'conjugation_link': f"{rootUrl}{a['href']}",
    'other_links': {}, 't_freq': 0
} for a in fSoup.select('#pop a[href]')}
vLen = len(vLinks)
error_verbs = {}
new_verbs = {}

for i, v in enumerate(vLinks):
    print(f'[{i+1} of {vLen}]', end=' ')
    vLink = vLinks[v]['conjugation_link']
    vlSoup = linkToSoup(vLink, returnErr=True)
    if isinstance(vlSoup, str):
        error_verbs[v] = vlSoup
        continue

    mLink = vlSoup.select_one('#verbeNav a[href^="/conjugaison/anglais/"]')
    if mLink:
        vLinks[v]['meaning'] = f"to {mLink.get_text(' ', strip=True)}"

    for a in vlSoup.select('aside a[class^="t"][href]'):
        freq_verb = a.get_text(' ', strip=True)
        if freq_verb not in vLinks:
            new_verbs[freq_verb] = {
                'meaning': '', 'conjugation_link': f"{rootUrl}{a['href']}",
                'other_links': {}, 't_freq': 0
            }
        else:
            freq_level = a['class'][0][1:]
            if freq_level.isdigit():
                vLinks[freq_verb]['t_freq'] = int(freq_level)

    for a in vlSoup.select('#verbeNav a[href^="/conjugaison/verbe/"]'):
        aText = a.get_text(' ', strip=True)
        vLinks[v]['other_links'][aText] = f"{rootUrl}{a['href']}"

with open('all_verbs.json', 'w') as f:
    json.dump(vLinks, f, indent=4)
