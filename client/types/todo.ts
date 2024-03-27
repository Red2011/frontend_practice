
export interface Priority {
    "_id": string,
    "priority_name": string
}

export interface Mark {
    "_id": string,
    "mark_name": string
}

export interface Todo {
    "_id": string,
    "name": string,
    "creation_date": Date,
    "priority": Priority,
    "mark": [Mark],
    "description": string,
    "__v": number
}

export interface Marks {
    size: number,
    marks: Mark[]
}

export interface Priorities {
    size: number,
    priorities: Priority[]
}

export interface TodoItemProps {
    todo: Todo
}
