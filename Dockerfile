FROM node:10.1.0

WORKDIR /ethInteract

COPY . /ethInteract

RUN npm install

EXPOSE 3001

ENV NAME EthInteract

CMD ["node", "ethWeb3Server"]