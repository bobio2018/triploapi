# QtumAI

QtumAI is a conversation AI framework built on Qtum blockchain and Google Machine Learning technology to provide user intuitive experience when accessing Blockchain services and dapps

# QtumAIWallet


`QtumAIWallet` is Slack bot for manage Qtum fund using QtumAI framework, it can understand natural language input from  user and implement basic account related actions like account balance query, send Qtum tokens to an address or other users on slack, or check own address.

This is a social dapp to provide user easy access to Qtum blockchain service for mass adoption.

![QtumAIWallet](https://github.com/qtumai/QtumAIWalletSlack/blob/master/assets/22.png "QtumAIWallet")


## For demo purpose, for now this bot only supports Qtum testnet tokens


This bot creates a new Qtum address when user interacts with the bot for the first time and initial balance is `0`. You can use [Qtum testnet faucet](http://testnet-faucet.qtum.info/#!/) to transfer fund into your new address to test.

This repository is the Web API app to handle slack inputs, interact with Qtum blockchain and render responses in rich message formats back to Slack user. Production environment variables are not exposed for security reason.



# Demo

![QtumAIWallet](https://github.com/qtumai/QtumAIWalletSlack/blob/master/assets/1.png "QtumAIWallet")

Join our slack channel, find **`@QtumAIWallet`** in Apps section and start chatting!

https://join.slack.com/t/qtumai/shared_invite/enQtNzI5NTE3MTIyMzg5LWE0NzE0OGE4ZjAwYmY4MmM1MzIyZDg3ZWEzOTBlOWNmNjJkNzI5N2QyYTg5ZjgyOWVjMDE5OWFhZWEwYjQ5NTE


*In the future, for non-privacy related queries, this bot can also be enabled in group chat*

# Converstion

We have been training the bot to understand different inputs from user, below are some examples, you can twist the question in some degree, AI will try to understand your input from historical dataset matching.


## Check Account Balance

```
What is my balance
Check account
show my account
how much qtum do I have
```

![QtumAIWallet](https://github.com/qtumai/QtumAIWalletSlack/blob/master/assets/4.png "QtumAIWallet")


## Deposit (receive)
```
How do I get token
I want to deposit
how can I receive qtum
```

![QtumAIWallet](https://github.com/qtumai/QtumAIWalletSlack/blob/master/assets/22.png "QtumAIWallet")


## Send fund

you can send fund by specifying a Qtum address, or `@` the user on slack group, this is a great way to send fund to people you know on slack, without remembering their Qtum address

```
send 10 qtum to @jake
transfer 5 qtum to qQUR13NRe4FPwLR99Qsdk4XgZ7o43iLq4i
```

![QtumAIWallet](https://github.com/qtumai/QtumAIWalletSlack/blob/master/assets/3.png "QtumAIWallet")


Please note it may take up to 1 minute for transfer to be confirmed on Qtum blockchain, bot will display the tx link in chat so you can track it on [Qtum testnet explorer](https://testnet.qtum.info/).

# Technology stacks

1. [QtumJS Wallet library](https://github.com/qtumproject/qtumjs-wallet)
2. QtumAI framework 
3. Google Machine Learning
4. Heroku
5. NodeJS








