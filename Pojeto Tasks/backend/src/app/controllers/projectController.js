const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Project = require('../models/Project');
const Task = require('../models/Task');


const router = express.Router();

router.use(authMiddleware);

router.get('/',async(req,res)=>{
    try {
        const projects = await Project.find().populate(['user','tasks']); // Find achar todos os projetos criados!// populale para chamar os dados da Schema de usuarios

        return res.send({projects})

    } catch (error) {
        return res.status(400).send({error:"Error loading projects"});
    }
});

router.get('/:projectId',async(req,res)=>{
    try {
        const project = await Project.findById(req.params.projectId).populate('user'); // Find achar todos os projetos criados!// populale para chamar os dados da Schema de usuarios

        return res.send({project})

    } catch (error) {
        return res.status(400).send({error:"Error loading projects"});
    }
});


//Rota para criação de uma tarefa 
router.post('/',async(req,res)=>{ // Sempre que for criar uma API RestFull de  que faz todas as 4 operações de crud sempre comece criando a rota de "CRIAÇÃO"

    
    try {
        const {title, description, tasks} = req.body;

        const project = await Project.create({title,description, user: req.userId});// o req.userId só consegue ser capturado pelo simples motivo de passamos ele na autenficação;

        //com esse promise.all ele so irá executar a linha 52 apos tudo abaixo ser executado
        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({...task, project: project._id});

            await projectTask.save();
            project.tasks.push(projectTask);
        }));

        await project.save(); // após ter feito a criação das tasks a cima salvamos novamente para assim atualizar as tasks no nosso banco de dados
        

        return res.send({project});
    } catch (err) {
        console.log(err)
        return res.status(400).send({error:"Error creating new project"});
    }
});

router.put('/:projectId',async(req,res)=>{ //Projectid para selecionar que lista de projetos queremos (atualizar/excluir);
    try {
        const {title, description, tasks} = req.body;

        const project = await Project.findByIdAndUpdate(req.params.projectId,{
            title,
            description,
            }, {new:true});// Por padrão o mongoose retorna o valor antigo não o valor atualizado por isso o new:true

            project.tasks = [];
            await Task.remove({project : project._id});

        //com esse promise.all ele so irá executar a linha 52 apos tudo abaixo ser executado
        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({...task, project: project._id});

            await projectTask.save();
            project.tasks.push(projectTask);
        }));

        await project.save(); // após ter feito a criação das tasks a cima salvamos novamente para assim atualizar as tasks no nosso banco de dados
        

        return res.send({project});
    } catch (err) {
        console.log(err)
        return res.status(400).send({error:"Error updating project"});
    }
});

router.delete('/:projectId',async(req,res)=>{
    try {
        const project = await Project.findByIdAndRemove(req.params.projectId); // FindByIdAndRemove acha o projeto passado e automaticamente remove 
        return res.send()

    } catch (error) {
        return res.status(400).send({error:"Error deleting projects"});
    }
});


module.exports = app => app.use('/projects',router);