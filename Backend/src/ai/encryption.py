from phe import paillier

# Generate keys once (store private key securely on user device)
public_key, private_key = paillier.generate_paillier_keypair()

def encrypt_score(score):
    return public_key.encrypt(score).ciphertext()

def decrypt_score(encrypted_score):
    return private_key.decrypt(paillier.EncryptedNumber(public_key, encrypted_score))

# Example usage:
# On client (mobile): 
#   encrypted = encrypt_score(0.85)
# On server: 
#   Store encrypted value (can perform math operations)
# On client: 
#   decrypted = decrypt_score(encrypted_value)