const inquirer = require('inquirer')
const chalk = require('chalk')

const fs = require('fs')

option()

function option(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que deseja fazer?',
            choices: [
                'Criar pasta', 
                'Criar arquivo',
                'Excluir arquivo',
                'Excluir pasta',
                'Ler arquivo',
                'Sair'
            ]
        }
    ]).then((answer) => {
        const action = answer['action']

        if(action === 'Criar pasta'){
            createDir()
        } else if(action === 'Criar arquivo'){
            createFile()
        } else if(action === 'Excluir arquivo'){
            removeFile()
        } else if(action === 'Excluir pasta'){
            removeDirectory()
        } else if(action === 'Ler arquivo'){
            readFile()
        } else if(action === 'Sair'){
            console.log(chalk.bgBlue.black('Obrigado por usar o criador de pastas e arquivos!'))
          process.exit()
        }

    }).catch((err)=>{console.log(err)})
}

function createDir(){
    inquirer.prompt([
        {
            name: 'nameDirectory',
            message: 'Nome da pasta a ser criada: '
        }
    ]).then((answer) => {
        const nameDirectory = answer['nameDirectory']

        if(!fs.existsSync(`locals/${nameDirectory}`)){
            fs.mkdirSync(`locals/${nameDirectory}`)
            console.log(chalk.bgGreen.black("Pasta criada"))
            option()
        } else{
            console.log(chalk.bgRed.black("Pasta já existe"))
            createDirectory()
        }       
    }).catch((err)=> {console.log(err)})
}

function createFile(){
    inquirer.prompt([
        {
            name: 'createFile',
            message: 'Qual o nome do arquivo a ser criado?  '
        },
        {
            name: 'selectPaste',
            message: 'Salvar em qual pasta? '
        }
    ]).then((answer) => {
        const file = answer['createFile']
        const selectPaste = answer['selectPaste']
        
        // console.log(file)
        // console.log(selectPaste)

        if(!fs.existsSync(`locals/${selectPaste}`)){
            console.log(chalk.bgRed.black("Esta pasta não existe"))
            createFile()
        }

        if(fs.existsSync(`locals/${selectPaste}/${file}.txt`)){
            console.log(chalk.bgRed.black("Esta arquivo já existe"))
            createFile()
        }

        fs.writeFileSync(
            `locals/${selectPaste}/${file}.txt`,
            'Dados',
            function(err){console.log(err)}
        )

        option()

    }).catch((err) => {console.log(err)})
}

function removeFile(){
    inquirer.prompt([
        {
            name: 'directory',
            message: "Em qual pasta o arquivo se encontra? "
        },
        {
            name: 'removeFile',
            message: 'Qual arquivo será removido? '
        }
    ]).then((answer) => {
        const directory = answer['directory']
        const remove = answer['removeFile']

        if(!fs.existsSync(`locals/${directory}`)){
            console.log(chalk.bgRed.black("Esta pasta não existe!"))
            removeFile()
        } else if(!fs.existsSync(`locals/${directory}/${remove}.txt`)){
            console.log(chalk.bgRed.black("Este arquivo não existe!"))
            removeFile()
        } else {
            fs.unlinkSync(`locals/${directory}/${remove}.txt`)
            console.log(chalk.bgGreen.black("Arquivo removido!"))
            option()
        }
    }).catch((err) => {console.log(err)})
}

function removeDirectory(){
    inquirer.prompt([
        {
            name: 'removeDirectory',
            message: 'Qual o nome da pasta a ser removida? '
        }
    ]).then((answer) => {
        const remove = answer['removeDirectory']

        if (!fs.existsSync(`locals/${remove}`)){
            console.log(chalk.bgRed.black("Esta pasta não existe!"))
            removeDirectory()
        } else {
            fs.rmdirSync(`locals/${remove}`)
            console.log(chalk.bgGreen.black("Pasta removida!"))
            option()
        }
    }).catch((err) => {console.log(err)})
}

function readFile(){
    inquirer.prompt([
        {
            name: 'fileRead',
            message: 'Qual arquivo será lido? '
        }, 
        {
            name: 'directory',
            message: "Em qual diretório se encontra o arquivo? "
        }
    ]).then((answer) => {
        const file = answer['fileRead']
        const directory = answer['directory']

        if (!fs.existsSync(`locals/${directory}`)){
            console.log(chalk.bgRed.black("Esta pasta não existe!"))
            readFile()
        } else if(!fs.existsSync(`locals/${directory}/${file}.txt`)){
            console.log(chalk.bgRed.black("Este arquivo não existe!"))
            readFile()
        } else {
            fs.readFile(`./locals/${directory}/${file}.txt`, 'utf-8', (err, data) => {
                console.log(chalk.bgBlack.yellow(data))
            })
        }
    }).catch((err) => {console.log(err)})
    // fs.readFile('./jogos/doom.txt', 'utf-8', function (err, data) {
    //     if(err) throw err;
    //     console.log(chalk.bgBlack.yellow(data));
    // });
}