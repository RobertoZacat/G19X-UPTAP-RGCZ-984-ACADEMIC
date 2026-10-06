import os
from dotenv import load_dotenv
from app.database import SessionLocal
from app import models, auth

load_dotenv()

def crear_admin_inicial():
    db = SessionLocal()

    email = input("Email del administrador: ").strip()
    nombre = input("Nombre completo: ").strip()
    password = input("Contraseña: ").strip()

    existente = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    if existente:
        print(f"Ya existe un usuario con el email {email}")
        db.close()
        return

    nuevo_admin = models.Usuario(
        nombre=nombre,
        email=email,
        password_hash=auth.hash_password(password),
        rol="admin"
    )
    db.add(nuevo_admin)
    db.commit()
    print(f"Administrador '{nombre}' creado correctamente.")
    db.close()

if __name__ == "__main__":
    crear_admin_inicial()