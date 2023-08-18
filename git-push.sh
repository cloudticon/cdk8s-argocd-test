git config --global user.email "gitops@devticon.com"
git config --global user.name "gitops"
git clone https://$GH_TOKEN@github.com/cloudticon/gitops ./gitops
cd gitops
mkdir -p production
cp ../k8s/dist/* ./production
git add -u .
git ls-files --deleted -z | xargs -0 git rm
git commit -m "gitops-$(date +%s )"
git push --set-upstream origin master
cd ../
rm -rf gitops