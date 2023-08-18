git config --global user.email "you@example.com"
git config --global user.name "Your Name"
git clone https://$GH_TOKEN@github.com/cloudticon/gitops ./gitops
cd gitops
cp ../k8s/dist/* ./
git add .
git commit -m "test"
git push --set-upstream origin master
cd ../
rm -rf gitops