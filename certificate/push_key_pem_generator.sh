openssl x509 -in aps_development.cer -inform der -out PushChatCert.pem
openssl pkcs12 -nocerts -out PushChatKey.pem -in Push.p12
cat PushChatCert.pem PushChatKey.pem > ck.pem