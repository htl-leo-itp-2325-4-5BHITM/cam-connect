import { esbuildPlugin } from "@web/dev-server-esbuild"

/*
global.process = {
    env: {
        NODE_ENV :'development'
    }    
}
*/
/*
global.process = global.process || {}
global.process.env = global.process.env || {}
global.process.env.NODE_ENV = "development"
*/
export default {
    plugins: [esbuildPlugin({ ts: true })]
}
