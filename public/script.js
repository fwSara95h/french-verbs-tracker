document.getElementById('wordInput').addEventListener('focus', function() {
    fetch('/verbs/suggestions')
        .then(response => response.json())
        .then(data => {
            const dataList = document.getElementById('verbSuggestions');
            dataList.innerHTML = '';  // Clear previous options
            data.forEach((verb) => {
                const option = document.createElement('option');
                option.value = verb;
                dataList.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching verb suggestions:', error));
});

document.getElementById('wordInput').addEventListener('input', function(e) {
    const selectedValue = e.target.value;
    if (!selectedValue) return;
    fetch(`/words/${selectedValue}`)  // Directly fetch verb details
        .then(response => {
            if (response.ok) {
                return response.json();  // Only proceed if the response is OK
            } else if (response.status === 404) {
                throw new Error('Verb not found');  // Throw an error for 404 but do nothing about it
            }
            throw new Error('Failed to fetch verb details');
        })
        .then(verbDetails => {
            document.getElementById('modalHeader').innerHTML = `<h2>${selectedValue}</h2>`;
            document.getElementById('meaningInput').value = verbDetails.meaning || '';
            document.getElementById('linkInput').value = verbDetails.conjugation_link || '';
            modal.style.display = 'flex';  // Open the modal with the details filled
        })
        .catch(error => {
            if (error.message === 'Verb not found') {
                console.log('Verb not found, do nothing');  // Log and do nothing
            } else {
                console.error('Error fetching verb:', error);  // Handle other errors differently if needed
            }
        });
});


document.addEventListener('DOMContentLoaded', function () {
    fetchWords();

    const wordInput = document.getElementById('wordInput');
    const addButton = document.getElementById('addButton');
    const wordList = document.getElementById('wordList');
    const modal = document.getElementById('modal');
    const modalHeader = document.getElementById('modalHeader');
    const closeModal = document.querySelector('.close');
    const saveButton = document.getElementById('saveButton');
    const meaningInput = document.getElementById('meaningInput');
    const linkInput = document.getElementById('linkInput');
    let currentWord = '';
    modal.style.display = 'none';

    wordInput.addEventListener('input', () => {
        addButton.disabled = !wordInput.value.trim();
    });

    wordInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !addButton.disabled) {
            event.preventDefault();
            addWord();
        }
    });

    addButton.addEventListener('click', addWord);

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    saveButton.addEventListener('click', () => {
        const meaning = document.getElementById('meaningInput').value.trim();
        const link = document.getElementById('linkInput').value.trim();
        
        if (meaning && link) { 
            saveNewWord(currentWord, meaning, false, link);
            modal.style.display = 'none';
        }
    });

    function addWord() {
        currentWord = wordInput.value.trim().toLowerCase();
        if (currentWord) {
            fetch(`/words/check/${currentWord}`)
                .then(response => response.json())
                .then(data => {
                    if (data.exists) {
                        showBanner();
                    } else {
                        modalHeader.innerHTML = `<h2>${currentWord}</h2>`;
                        meaningInput.value = '';
                        linkInput.value = '';
                        modal.style.display = 'flex';
                    }
                })
                .catch(error => {
                    console.error('Error checking word existence:', error);
                });
        }
        wordInput.value = '';
        addButton.disabled = true;
    }
    

    // Function to handle word deletion
    function deleteWord(infinitif) {
        fetch('/words', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ infinitif })
        })
            .then(response => {
                if (response.ok) {
                    fetchWords(); // Refresh the list after deletion
                }
            });
    }
    function cleanWord(word_infinitif){
        cleaned_infinitif = word_infinitif.replace("'",'');
        cleaned_infinitif = cleaned_infinitif.replace(" ",'-');
        //console.log(word_infinitif, '--->', cleaned_infinitif);
        return cleaned_infinitif;
    }

    function fetchWords() {
        fetch('/words')
            .then(response => response.json())
            .then(words => {
                wordList.innerHTML = '';
                words.sort((a, b) => a.infinitif.localeCompare(b.infinitif)).forEach(word => {
                    const wordElement = document.createElement('div');
                    wordElement.className = 'word-item';
                    wordElement.title = word.meaning;
                    wordElement.innerHTML = `
                        <input type="checkbox" ${word.conjugated ? 'checked' : ''} id="check-${cleanWord(word.infinitif)}">
                        <a href="${word.conjugation_link}" class="word-link">${word.infinitif}
                            <div class="tooltip">${word.meaning}</div>
                        </a>
                        <div class="delete-btn">&times;</div>
                    `;

                    // Event listener for the delete button
                    const deleteBtn = wordElement.querySelector('.delete-btn');
                    deleteBtn.onclick = () => deleteWord(word.infinitif);

                    // Event listener for checkbox to update conjugation status
                    const checkbox = wordElement.querySelector(`#check-${cleanWord(word.infinitif)}`);
                    checkbox.onchange = (e) => updateConjugated(word.infinitif, e.target.checked);

                    wordList.appendChild(wordElement);
                });
            });
    }



    function saveNewWord(infinitif, meaning, is_conjugated, conjugation_link) { 
        fetch('/words', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                infinitif: infinitif, 
                meaning: meaning, 
                conjugation_link: conjugation_link,
                is_conjugated: false, 
             })
        })
            .then(response => {
                if (response.ok) {
                    fetchWords(); // Refresh the list after deletion
                }
            }) 
    }

    function updateConjugated(infinitif, is_conjugated) {
        fetch('/words', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ infinitif, is_conjugated })
        })
            .then(response => {
                if (response.ok) {
                    fetchWords(); // Refresh the list after deletion
                }
            }) 
    }

    function showBanner() {
        const banner = document.getElementById('banner');
        banner.style.display = 'block';
        setTimeout(() => {
            banner.style.display = 'none';
        }, 3000);
    }
});