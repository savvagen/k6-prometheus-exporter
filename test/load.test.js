import http from 'k6/http'
import {sleep, check, group} from 'k6'
import { randomIntBetween,  randomString, randomItem, uuidv4, findBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

export let options = {
    vus: 3,
    duration: '60m',
    //duration: '1m30s',
    thresholds: {
        http_req_failed: ['rate<=0'],
        http_req_duration: ['p(95)<500']
    },
    // env: { BASE_URL: "http://localhost:3001" },
    // httpDebug: "full" // output the requests and responses with json bodys
}

const PAUSE = 0.5;
const BASE_URL = __ENV.BASE_URL !== undefined ? __ENV.BASE_URL: "http://localhost:3001"

let params = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    tags: {
        name: 'POST /users', // first request
    }
}


export function setup(){
    // 1. Set Up User
    console.log("Setup Test!")
    let user = {
        name: `Test${randomIntBetween(1000,9999)} User${randomIntBetween(1000,9999)}`,
        username: `test.user${randomIntBetween(1000,9999)}`,
        email: `test.user.${randomString(10)}@example.com`,
    }
    let user_resp = http.post(`${BASE_URL}/users`, JSON.stringify(user), params)
    check(user_resp, {
        'is status 201': (r) => r.status === 201,
        'is api id present': (r) => r.json().hasOwnProperty('id'),
    })
    sleep(PAUSE)
    // Return the data as JSON
    return { data: {
            userId: user_resp.json()['id'],
            email: user.email,
        }}
}


export default function(data){

    group('posts writer scenario', (_)=> {
        //console.log(JSON.stringify(data))
        //console.log(data.data.userId);

        // 2. Create ToDo for created user

        params.tags.name = 'POST /todos'
        let todo_payload = JSON.stringify({
            userId: data.data.userId,
            title: `ToDo - ${randomIntBetween(1000, 9999)}: ${randomString(20)}`,
            completed: randomItem([true, false])
        })
        let todo_resp = http.post(`${BASE_URL}/todos`, todo_payload, params)
        check(todo_resp, {
            'is status 201': (r) => r.status === 201,
            'is api id present': (r) => r.json().hasOwnProperty('id'),
        })
        //console.log(`${todo_resp.status}: ${todo_resp.status_text} ${JSON.stringify(todo_resp.json())}`)
        sleep(PAUSE);

        // 3. Create 5 posts

        for(let i = 0; i < 5; i++){
            params.tags.name = 'POST /posts'
            let post_payload = JSON.stringify({
                title: `New Post ${randomIntBetween(1,1000)}`,
                body: `Hello World ${randomString(10)}`,
                userId: data.data.userId
            })
            let posts_resp = http.post(`${BASE_URL}/posts`, post_payload, params)
            check(posts_resp, {
                'is status 201': (r) => r.status === 201,
                'is api id present': (r) => r.json().hasOwnProperty('id'),
            })
            //console.log(`${posts_resp.status}: ${posts_resp.status_text} ${JSON.stringify(posts_resp.json())}`)
            sleep(randomIntBetween(1,2)); // Sleep in between 1 - 3 sec.

            // Create 3 comments for each post

            for(let i = 0; i < 3; i++){
                params.tags.name = 'POST /comments'
                let comment_payload = JSON.stringify({
                    name: `Comment Test - ${randomIntBetween(1,1000)}`,
                    email: `${data.data.email}`,
                    body: `Comment-${posts_resp.json()['id']} Comment: ${randomString(20)}`,
                    postId: posts_resp.json()['id']
                })
                let comment_resp = http.post(`${BASE_URL}/comments`, comment_payload, params)
                check(comment_resp, {
                    'is status 201': (r) => r.status === 201,
                    'is api id present': (r) => r.json().hasOwnProperty('id'),
                })
                //console.log(`${comment_resp.status}: ${comment_resp.status_text} ${JSON.stringify(comment_resp.json())}`)
                sleep(randomItem([0.5, 1])); // Sleep in between 0.5 - 1 sec.
            }
        }
    })

}


export function teardown(data){
    console.log("Teardown Test!")

    let emailIsOK = /test.user.*@example.com/.test(data.data.email)
    console.log(emailIsOK)
    if (!emailIsOK) {
        throw new Error('incorrect data -> email: ' + data.data.email);
    } else {
        console.log(JSON.stringify(data))
    }
}