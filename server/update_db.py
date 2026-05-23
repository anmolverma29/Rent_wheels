import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'database.db')
conn = sqlite3.connect(db_path)
c = conn.cursor()
c.execute("UPDATE users SET name='Amit Kumar' WHERE email='admin@rentwheels.com'")
conn.commit()
print('Updated Database Successfully')
conn.close()
