import json
import pymysql

# Database connection parameters
host = 'localhost'
user = 'root'
password = 'password'
database = 'francais_db'


def connect_to_db():
    """ Create database connection """
    return pymysql.connect(host=host,
                           user=user,
                           password=password,
                           database=database,
                           cursorclass=pymysql.cursors.DictCursor)


def read_json_file(filepath):
    """ Read JSON data from a file """
    with open(filepath, 'r', encoding='utf-8') as file:
        return json.load(file)


def insert_verbs(cursor, verb_data):
    """ Insert verb data into the all_verbs table """
    sql = """
    INSERT INTO all_verbs (infinitif, meaning, t_freq, conjugation_link)
    VALUES (%s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
    meaning=VALUES(meaning), t_freq=VALUES(t_freq), conjugation_link=VALUES(conjugation_link);
    """
    cursor.execute(sql, (verb_data['infinitif'],
                         verb_data['meaning'],
                         verb_data['t_freq'],
                         verb_data['conjugation_link']))


def insert_other_links(cursor, infinitif, other_links):
    """ Insert other links into the other_links table """
    sql = """
    INSERT INTO other_links (infinitif, link_title, link_url)
    VALUES (%s, %s, %s)
    ON DUPLICATE KEY UPDATE
    link_url=VALUES(link_url);
    """
    for title, url in other_links.items():
        cursor.execute(sql, (infinitif, title, url))


def main():
    # Connect to the MySQL database
    connection = connect_to_db()
    try:
        # Read verb data from JSON file
        verbs_data = read_json_file('all_verbs.json')

        # Cursor to execute SQL queries
        with connection.cursor() as cursor:
            for infinitif, details in verbs_data.items():
                verb_details = {
                    'infinitif': infinitif,
                    'meaning': details['meaning'],
                    't_freq': details['t_freq'],
                    'conjugation_link': details['conjugation_link']
                }
                # Insert verb into verbs table
                insert_verbs(cursor, verb_details)

                # Insert associated links into other_links table
                if 'other_links' in details:
                    insert_other_links(cursor,
                                       infinitif,
                                       details['other_links'])

        # Commit the changes
        connection.commit()
    except Exception as e:
        print(f"An error occurred: {e}")
        connection.rollback()
    finally:
        connection.close()


if __name__ == "__main__":
    main()
