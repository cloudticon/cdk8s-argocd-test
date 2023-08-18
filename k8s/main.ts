import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { Deployment} from "cdk8s-plus-25";
import {YamlOutputType} from "cdk8s/lib/app";

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);
    const deployment =new Deployment(this, 'api', {
      containers: [
        {
          name: "api",
          image: process.env.IMAGE!,
          port: 3000
        }
      ]
    });
    deployment.exposeViaIngress("/test", {

      // ports: [{port: 3000}]
    })
  }
}

const app = new App({
  yamlOutputType: YamlOutputType.FILE_PER_RESOURCE
});
new MyChart(app, 'cdk8s-argocd-test');
app.synth();
