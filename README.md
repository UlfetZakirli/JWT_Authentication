# JWT_Authentication

### Used Technologies
* Node.js
* Express.js
* JWT (JSON Web Token), accessToken/refreshToken
* Vite.js
* Axios (axios.interceptors, axios instance)

<img width="489" alt="first" src="https://user-images.githubusercontent.com/88549805/218738033-fae857f7-2eab-4d44-8c00-99ddb6d46ab1.png">   

<img width="885" alt="second" src="https://user-images.githubusercontent.com/88549805/218738055-b1ef119d-7328-4751-aec3-9049595d6651.png">



### ***What is JSON Web Token?***

JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.   


### ***When should you use JSON Web Tokens?***

**Authorization**: This is the most common scenario for using JWT. Once the user is logged in, each subsequent request will include the JWT, allowing the user to access routes, services, and resources that are permitted with that token. Single Sign On is a feature that widely uses JWT nowadays, because of its small overhead and its ability to be easily used across different domains.

**Information Exchange**: JSON Web Tokens are a good way of securely transmitting information between parties. Because JWTs can be signed—for example, using public/private key pairs—you can be sure the senders are who they say they are. Additionally, as the signature is calculated using the header and the payload, you can also verify that the content hasn't been tampered with.

### ***What is the JSON Web Token structure?***

In its compact form, JSON Web Tokens consist of three parts separated by dots (.), which are:

* Header
* Payload
* Signature

Therefore, a JWT typically looks like the following.

**xxxxx.yyyyy.zzzzz**

<img width="942" alt="jwt" src="https://user-images.githubusercontent.com/88549805/218258631-51f34427-9384-4194-bbfc-40a907fed8ca.png">
