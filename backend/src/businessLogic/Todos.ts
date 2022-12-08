import {TodosAccess} from "../dataLayer/TodosAccess";
import {TodoItem} from "../models/TodoItem";
import {parseUserId} from "../auth/utils";
import {TodoUpdate} from "../models/TodoUpdate";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";


const uuidv4 = require('uuid/v4');
const todosAccess = new TodosAccess();

export async function getAllTodo(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return todosAccess.getAllTodo(userId);
}

export function createTodo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const userId = parseUserId(jwtToken);
    const todoId =  uuidv4();
    const s3_BucketName = process.env.S3_BUCKET_NAME;
    
    return todosAccess.createTodo({
        userId: userId,
        todoId: todoId,
        createdAt: new Date().getTime().toString(),
        done: false,
        attachmentUrl:  `https://${s3_BucketName}.s3.amazonaws.com/${todoId}`, 
        ...createTodoRequest,
    });
}

export function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return todosAccess.updateTodo(updateTodoRequest, todoId, userId);
}

export function deleteTodo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return todosAccess.deleteTodo(todoId, userId);
}

export function generateUploadUrl(todoId: string): Promise<string> {
    return todosAccess.generateUploadUrl(todoId);
}