This tests some unsolved problems with `passport-hawk`, and my
proposed solutions. Some spec reading is still in order. Please
review, especially if you're steeped in web Authentication stuff.

## Assumptions

`jasmine-node` is installed globally at
`/usr/local/lib/node_modules/jasmine-node/` (as is done with the `n`
node version manager).

You're running `node` v0.11.9 or higher (must support --harmony).

You're ok with your npm cache being cleared for `passport-hawk` and
`_git-remotes`

## Note

I don't know of a better way to manage package versions in npm. If
someone's got a better trick, please share! The following kludge works
in a pinch (on Linux, anyway).

### To run tests with the `.fail` fixes in drfloob/passport-hawk:

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