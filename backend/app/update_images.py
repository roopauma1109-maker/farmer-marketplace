import sqlite3

conn = sqlite3.connect('agridirect.db')
cursor = conn.cursor()

updates = {
    'Drumstick': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    'Brinjal': 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&auto=format&fit=crop&q=80',
    'Green Chilli': 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&auto=format&fit=crop&q=80',
    'Tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    'Onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    'Potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    'Carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
    'Cabbage': 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&auto=format&fit=crop&q=80',
    'Banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    'Turmeric': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    'Paddy': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
}

for crop_name, url in updates.items():
    cursor.execute("UPDATE crops SET image_url = ? WHERE crop_name LIKE ?", (url, f"%{crop_name}%"))

conn.commit()
print("Updated all crop image URLs in agridirect.db successfully.")
