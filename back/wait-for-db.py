#!/usr/bin/env python3
import time
import subprocess
import sys

def check_db():
    """Vérifie si la base de données est accessible"""
    try:
        result = subprocess.run(
            ["curl", "-f", "http://db:81"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=5
        )
        return result.returncode == 0
    except Exception:
        return False

def main():
    print("En attente de la base de données...")
    max_attempts = 30
    attempt = 0

    while not check_db() and attempt < max_attempts:
        attempt += 1
        print(f"Base de données non disponible, tentative {attempt}/{max_attempts}, attente...")
        time.sleep(2)

    if attempt >= max_attempts:
        print("Impossible de se connecter à la base de données après plusieurs tentatives")
        sys.exit(1)

    print("Base de données disponible!")

    # Lancer l'application
    print("Démarrage de l'application...")
    subprocess.run(["java", "-jar", "target/ecommerce-api-0.0.1-SNAPSHOT.jar"])

if __name__ == "__main__":
    main()
