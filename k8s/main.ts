import {Construct} from 'constructs';
import {App, Chart, ChartProps} from 'cdk8s';
import {Deployment, Ingress, IngressBackend} from "cdk8s-plus-25";
import {YamlOutputType} from "cdk8s/lib/app";

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);
    const deployment =new Deployment(this, 'api', {
      metadata: {
        name: "api"
      },
      securityContext: {
        ensureNonRoot: false,
      },
      containers: [
        {
          name: "api",
          image: process.env.IMAGE!,
          port: 3000,
          securityContext: {
            ensureNonRoot: false
          }
        }
      ]
    });
    const service = deployment.exposeViaService({name: "api"});
    const ingress = new Ingress(this, "ingress", {
      metadata: {name: "api", annotations: {'kubernetes.io/ingress.class': 'haproxy',}},

    });
    ingress.addHostRule(`test-api-${process.env.ENV}.devticon.cloudticon.com`, "/", IngressBackend.fromService(service))
    ingress.addTls([{hosts: ["test-api.devticon.cloudticon.com"]}])
  }
}


const app = new App({
  yamlOutputType: YamlOutputType.FILE_PER_RESOURCE
});
new MyChart(app, 'cdk8s-argocd-test');
app.synth();
