//service should request data implement and export interfaces and provide simple set update functions
import { config, handleError } from '../base';
//endregion
export function getAllDeviceTypes() {
    return fetch(config.api_url + '/devicetype/getall')
        .then(response => {
        handleError(response.status);
        return response.json();
    })
        .then(data => {
        return data;
    })
        .catch(error => {
        console.error(error);
    });
}
//index should simply link between components and services
//# sourceMappingURL=devicetype-service.js.map