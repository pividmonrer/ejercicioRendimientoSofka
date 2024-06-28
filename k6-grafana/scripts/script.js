import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 20, // 20 hilos concurrentes
  duration: '10m', // durante 10 minutos
  ext: {
    loadimpact: {
      projectID: 123456,
      distribution: {
        "amazon:de:frankfurt": { loadZone: "amazon:de:frankfurt", percent: 100 }
      },
    },
  },
  thresholds: {
    'http_req_duration': ['p(95)<500'], // el 95% de las solicitudes deben completar en menos de 500ms
  },
};

export default function () {
  http.get('https://petstore.octoperf.com/actions/Catalog.action');
  sleep(1);
  http.get('https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH');
  sleep(1);
  http.get('https://petstore.octoperf.com/actions/Product.action?viewProduct=&productId=FI-SW-01');
  sleep(1);
}
