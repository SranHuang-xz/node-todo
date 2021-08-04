#!/usr/bin/env node
const program = require('commander')
const api = require('./index.js')
// console.log("d");
program
    .option('-x, --xxx', 'what the x')
// .option('-d, --debug', 'output extra debugging')
// .option('-s, --small', 'small pizza size')
// .option('-p, --pizza-type <type>', 'flavour of pizza');

program
    .command('add <taskName>')
    .description('add a task')
    .action((...args) => {
        const words = args.slice(0, -2).join('')
        api.add(words).then(() => {
            console.log('添加成功');
        },
            () => {
                console.log('添加失败');
            })
        // console.log("dddd");
    });
program
    .command('clear')
    .description('clear all tasks')
    .action(() => {
        api.clear().then(() => {
            console.log('清除完毕');
        },
            () => {
                console.log('清除失败');
            })
    });
// program
//     .command('show')
//     .description('show all tasks')
//     .action(() => {
//         api.showAll()
//     });
if (process.argv.length === 2) {
    api.showAll()

}
program.parse(process.argv);

