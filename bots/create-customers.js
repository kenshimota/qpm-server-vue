const customers = require("./customers.json");
const config = require("../src/utils/qpm.config.json");
const sleep = require("../src/utils/sleep");
const { QPM } = require("qpm-client-js");


const hashNameCustomers = new Set();
const categoryClient = customer => {
    if(
        customer 
        && customer.client_latitude 
        && customer.client_longitude 
        && !hashNameCustomers.has(customer.client_name)
    ) {
        hashNameCustomers.add(customer.client_name);
        return true;
    }
    else
        return false;
};

const main = async function(){
    const ClientQPM = QPM(config);
    const result = customers.filter(categoryClient);
    const paramsDefault = {
        site_address1: "",
        site_address2: "",
        site_city: "",
        site_state: "",
        site_zipcode: "",
        site_country: "",
        site_description: "",
        site_name: "",
    };


    for(let i = 0; i < result.length; i++){
        const customer = result[i];
        ClientQPM.method("addEditCustomer", { 
            custdata: {
                ...paramsDefault,
                code: customer.client_id,
                site_name: customer.client_name,
                description: customer.client_name,
                site_latitude: customer.client_latitude,
                site_longitude: customer.client_longitude,
            }
        });
        const response = await ClientQPM.fetch().then(response => response);
        await sleep(300);
        console.log(response);
    }

};

main();