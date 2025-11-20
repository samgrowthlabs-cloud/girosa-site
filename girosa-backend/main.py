from fastapi import FastAPI
import psycopg2
import os

app = FastAPI()

def get_conn():
    return psycopg2.connect(
        host=os.environ["PGHOST"],
        user=os.environ["PGUSER"],
        password=os.environ["PGPASSWORD"],
        database=os.environ["PGDATABASE"],
        port=os.environ["PGPORT"]
    )

@app.get("/braids")
def get_braids():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, code, title, description, price, image, category FROM braids")
    rows = cur.fetchall()
    conn.close()

    return [
        {
            "id": r[0],
            "code": r[1],
            "title": r[2],
            "description": r[3],
            "price": r[4],
            "image": r[5],
            "category": r[6]
        }
        for r in rows
    ]
