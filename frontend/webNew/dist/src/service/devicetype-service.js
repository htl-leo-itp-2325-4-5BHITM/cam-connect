//service should request data implement and export interfaces and provide simple set update functions
import { config, handleError } from '../base';
import { Observable } from "rxjs";
export let allDeviceTypes = new Observable((subscriber) => {
    fetch(config.api_url + '/devicetype/getall')
        .then(response => {
        handleError(response.status);
        return response.json();
    })
        .then(result => {
        console.log(result);
        subscriber.next(result.data);
    })
        .catch(error => {
        console.error(error);
    });
});
//index should simply link between components and services
//# sourceMappingURL=devicetype-service.js.map