This assumes `jasmine-node` is installed globally at
`/usr/local/lib/node_modules/jasmine-node/` (as is done with the `n`
node version manager).

I don't know of a better way to manage package versions in npm, but
the following works anyway (on Linux).

### To run tests with the `.fail` fixes proposed in jfromaniello/passport-hawk#6

```bash
npm install
npm test
```

### To run the current `.error` version jfromaniello/passport-hawk:

```bash
npm remove passport-hawk
npm cache clear passport-hawk
npm cache clear _git-remotes
sed -i 's#git://github.com/drfloob/passport-hawk#^0.2.0#' package.json
npm install
npm test
```

### To get back to the fixed version:

```bash
npm remove passport-hawk
npm cache clear passport-hawk
npm cache clear _git-remotes
git checkout -- package.json
npm install
npm test
```