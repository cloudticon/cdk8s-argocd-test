import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import {IntOrString, KubeDeployment, KubeService} from "cdk8s-plus-25/lib/imports/k8s";
import {YamlOutputType} from "cdk8s/lib/app";

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);
    const label = { app: 'hello-k8s' };
    new KubeService(this, 'service', {
      spec: {
        type: 'ClusterIP',
        ports: [ { port: 80, targetPort: IntOrString.fromNumber(8080) } ],
        selector: label
      }
    });

    new KubeDeployment(this, 'deployment', {
      spec: {
        replicas: 2,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'hello-kubernetes',
                image: process.env.IMAGE,
                ports: [ { containerPort: 8080 } ]
              }
            ]
          }
        }
      }
    });
  }
}

const app = new App({
  yamlOutputType: YamlOutputType.FILE_PER_RESOURCE
});
new MyChart(app, 'cdk8s-argocd-test');
app.synth();
