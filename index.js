const homedir = require('os').homedir()
const home = process.env.HOME || homedir //自己设置的
const fs = require('fs')
const inquirer = require('inquirer');
const p = require('path')
const dbPath = p.join(home, '.todo')
const db = require('./db.js')
module.exports.add = async (title) => {
    const list = await db.read()
    list.push({ title, done: false })
    await db.write(list)

}

module.exports.clear = async () => {
    await db.write([])

}
function askForAction(list, index) {
    inquirer.prompt({
        type: 'list', name: 'action',
        message: '请选择操作',
        choices: [
            { name: '退出', value: 'quit' },
            { name: '已完成', value: 'markAsDone' },
            { name: '未完成', value: 'markAsUndone' },
            { name: '改标题', value: 'updateTitle' },
            { name: '删除', value: 'delete' },
        ]
    }).then(answers2 => {
        switch (answers2.action) {
            case 'markAsDone':
                list[index].done = true;
                db.write(list)
                break;
            case 'markAsUndone':
                list[index].done = false;
                db.write(list)
                break;
            case 'updateTitle':
                inquirer.prompt({
                    type: 'input',
                    name: 'title',
                    message: '新的标题是'
                }).then(answers3 => {
                    list[index].title = answers3.title
                    db.write(list)
                })
                break;
            case 'delete':
                list.splice(index, 1)
                db.write(list)
                break
        }

    })
}

function askForCreateTask(list) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '输入任务标题'
    }).then(answers => {
        list.push({
            title: answers.title,
            done: false
        })
        db.write(list)
    })
}

function printTask(list) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'index',
                message: '请选择你想操作的任务',
                choices: [{ name: '退出', value: '-1' }, ...list.map((task, index) => {
                    return { name: `${task.done ? '[x]' : '[_]'} ${index + 1}--${task.title}`, value: index.toString() }
                }),
                { name: '+创建任务', value: '-2' }]
            },
        ])
        .then((answers) => {
            const index = parseInt(answers.index)
            if (index >= 0) {
                askForAction(list, index)
            }
            else if (index === -2) {
                askForCreateTask(list)
            }

        });
}
module.exports.showAll = async () => {
    console.log('showall');
    const list = await db.read()
    printTask(list)

}

