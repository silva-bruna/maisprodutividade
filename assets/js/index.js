(function() {
    //--------------------TAREFAS-----------------------
    const btAdicionarTarefa = document.querySelector('.tarefas__bt--adicionarTarefa');
    const listaTarefas = document.querySelector('.tarefas__lista');
    let tarefasConcluidas = 0;

    // ADICIONA TAREFA:
    btAdicionarTarefa.addEventListener('click', adicionarTarefa);

    document.addEventListener('keydown', function(e) {
        if (e.key == 'Enter') {
            adicionarTarefa();
        }
    });

    function adicionarTarefa() {
        const inputTarefa = document.querySelector('.tarefas__input');

        if (!inputTarefa.value) {
            window.alert('Informe a tarefa!');
        } else {
            criarItemTarefa(inputTarefa.value);
            resertarCampoTarefa(inputTarefa);
            calcularProgresso(); // para recalcular o total de tarefas
            controlarExibiçãoElementosTarefas();     
        }
    }

    // CRIA ELEMENTOS DOS ITENS DA LISTA DE TAREFAS:
    function criarItemTarefa(descricao) {
        const novaTarefa = document.createElement('li');
        novaTarefa.classList.add('lista__tarefa');

        criarCheckboxTarefa(novaTarefa); 
        criarDescricaoTarefa(novaTarefa, descricao);
        criarBtExcluirTarefa(novaTarefa);

        listaTarefas.appendChild(novaTarefa);
    }

    function criarCheckboxTarefa(novaTarefa) {
        const checkboxTarefa = document.createElement('input');
        checkboxTarefa.setAttribute('type', 'checkbox');
        checkboxTarefa.classList.add('tarefa__checkbox');

        novaTarefa.appendChild(checkboxTarefa);
    }

    function criarDescricaoTarefa(novaTarefa, descricao) {
        const descricaoTarefa = document.createElement('p');
        descricaoTarefa.classList.add('.tarefa__decricao');
        descricaoTarefa.innerText = descricao;

        novaTarefa.appendChild(descricaoTarefa);
    }

    function criarBtExcluirTarefa(novaTarefa) {
        const btExcluirTarefa = document.createElement('button');
        btExcluirTarefa.classList.add('tarefa__bt--excluir', 'bt');
        btExcluirTarefa.innerText = 'Excluir';

        novaTarefa.appendChild(btExcluirTarefa);
    }

    // CONTROLA AS MANIPULAÇÕES NOS ITENS DA LISTA DE TAREFAS:
    document.addEventListener('click', function(e) {
        const elemento = e.target;

        // CONTROLA A SELEÇÃO DO CHECKBOX DA TAREFA:
        if (elemento.classList.contains('tarefa__checkbox')) {
            if (elemento.checked) {
                tarefasConcluidas++; // se o usuário selecionar o checkbox
            } else {
                tarefasConcluidas--; // se o usuário retirar a seleção do checkbox
            };

            calcularProgresso();
        }

        // EXCLUI TAREFA:
        const elementoPai = elemento.parentElement;
        const checkboxTarefa = elementoPai.querySelector('.tarefa__checkbox');

        if (elemento.classList.contains('tarefa__bt--excluir')) {
            elementoPai.remove(); // remove o item da lista

            if (checkboxTarefa.checked) {
                tarefasConcluidas--;
            };

            controlarExibiçãoElementosTarefas();
            calcularProgresso();
        }
    });

    // RESETA O CAMPO DE TAREFA:
    function resertarCampoTarefa(inputTarefa) {
        inputTarefa.value = '';
        inputTarefa.focus();
    }

    // CALCULA O PROGRESSO DAS TAREFAS:
    function calcularProgresso() {
        const mensagemProgresso = document.querySelector('.progresso__mensagem');
        const barraProgresso = document.querySelector('.progresso__barra--preenchimento');
        const totalTarefas = listaTarefas.childElementCount;
        let porcentagemProgresso;

        if (totalTarefas == 0) {
            porcentagemProgresso = 0; 
        } else {
            porcentagemProgresso = Number.parseInt((tarefasConcluidas / totalTarefas) * 100);
        }
        
        mensagemProgresso.innerHTML = `${porcentagemProgresso}% tarefas concluídas`;
        barraProgresso.style.width = `${porcentagemProgresso}%`;
    }

    // CONTROLA A EXIBIÇÃO DOS ELEMENTOS DA SEÇÃO DE TAREFAS
    function controlarExibiçãoElementosTarefas() {
        const progresso = document.querySelector('.tarefas__progresso');

        if (listaTarefas.childElementCount == 0) {
            listaTarefas.style.display = 'none';
            progresso.style.display = 'none';
        } else {
            listaTarefas.style.display = 'flex';
            progresso.style.display = 'flex';
        }
    }

    //--------------------TEMPORIZADOR-----------------------
    const btIniciarTemporizador = document.querySelector('.controle__bt--iniciar');
    const btPausarTemporizador = document.querySelector('.controle__bt--pausar');
    const btReiniciarTemporizador = document.querySelector('.controle__bt--reiniciar');

    const timer = document.querySelector('.temporizador__timer');
    let contagemTimer;
    let segundos = 0;

    let intervaloFim;
    const opcoesTimerDiv = document.querySelector('.temporizador__opcoesTimer');
    const opcoesTimerInput = document.querySelectorAll('.opcoesTimer__opcao--input');
    const opcoesTimer = [
        {
            checkbox: document.querySelector('#opcoesTimer__opcao--25m'),
            inicioIntervalo: 1500, // Intervalo inicia após 25 minutos
            duracaoIntervalo: 300, // Intervalo dura 5 minutos
            duracaoExecucao: 1500 // Execução dura 25 minutos
        },

        {
            checkbox: document.querySelector('#opcoesTimer__opcao--1h'),
            inicioIntervalo: 3600, // Intervalo inicia após 1 hora
            duracaoIntervalo: 600, // Intervalo dura 10 minutos
            duracaoExecucao: 3600 // Execução dura 1 hora
        }
    ];

    // INICIA O TEMPORIZADOR:
    btIniciarTemporizador.addEventListener('click', () => {
        clearInterval(contagemTimer);
        iniciarTemporizador();
        configurarElementos('desativar');
    });

    function iniciarTemporizador() {
        contagemTimer = setInterval(() => {
            segundos++;

            timer.innerHTML = criarObjetoData(segundos);
            verificarIntervalo(segundos);
        }, 1000);
    }

    function criarObjetoData(segundos) {
        const data = new Date(segundos * 1000);

        return data.toLocaleTimeString('pt-BR', {
            hour12: false,
            timeZone: 'UTC'
        });    
    }

    // CONTROLA O INTERVALO:
    function verificarIntervalo(segundos) {
        const som = new Audio('assets/audio/notificacao.wav');

        for (let i=0; i < opcoesTimer.length; i++) {
            const opcao = opcoesTimer[i];

            if (opcao.checkbox.checked) {
                if (segundos == opcao.inicioIntervalo) {
                    som.play();
                    console.log(`intervalo INICIO ${segundos}`);
                
                    intervaloFim = opcao.inicioIntervalo + opcao.duracaoIntervalo;
                
                    // Calcula o início do próximo intervalo:
                    opcao.inicioIntervalo += opcao.duracaoIntervalo + opcao.duracaoExecucao;
                }

                if (segundos == intervaloFim) {
                    som.play();
                    console.log(`intervalo FIM ${segundos}`);
                }
            }
        }
    }

    // CONFIGURA AS OPÇÕES DO TIMER:
    function configurarElementos(acao) {
        const opcoesTimerLabel = document.querySelectorAll('.opcoesTimer__opcao--label');
        const opcoesTimerSpan = document.querySelectorAll('.opcoesTimer__opcao--span');

        // Desabilita as opções do timer quando ele é iniciado:
        if (acao == 'desativar') {
            for (let i = 0; i < opcoesTimer.length; i++) {
                opcoesTimerInput[i].setAttribute('disabled', 'true');

                opcoesTimerLabel[i].classList.add('opcoesTimer__opcao--label--desativado');

                opcoesTimerSpan[i].classList.add('opcoesTimer__opcao--span--desativado');
            }
        }

        // Habilita as opções do timer quando ele é reiniciado:
        if (acao == 'ativar') {
            for (let i = 0; i < opcoesTimer.length; i++) {
                opcoesTimerInput[i].removeAttribute('disabled');
                
                opcoesTimerLabel[i].classList.remove('opcoesTimer__opcao--label--desativado');

                opcoesTimerSpan[i].classList.remove('opcoesTimer__opcao--span--desativado');
            }
        }
    }

    // EXIBE INSTRUÇÃO PARA O USUÁRIO
    opcoesTimerDiv.addEventListener('click', () => {
        if (opcoesTimerInput[0].disabled) {
            window.alert('Para trocar a opção selecionada, é necessário "Reiniciar" o temporizador.');
        } 
    });

    // PAUSA O TIMER:
    btPausarTemporizador.addEventListener('click', () => {
        clearInterval(contagemTimer);
    });

    // REINICIA O TIMER:
    btReiniciarTemporizador.addEventListener('click', () => {
        clearInterval(contagemTimer);
        segundos = 0;
        timer.innerHTML = '00:00:00';
        
        opcoesTimer[0].inicioIntervalo = 1500; // 25 minutos
        opcoesTimer[1].inicioIntervalo = 3600; // 1 hora

        configurarElementos('ativar');
    });
})();
