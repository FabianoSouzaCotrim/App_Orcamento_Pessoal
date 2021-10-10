class Despesa{
    constructor(dia, mes, ano, tipo, descricao, valor){
        this.dia = dia
        this.mes = mes
        this.ano = ano
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for (let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
        }

    }

    ///OBJETO Banco de dados (WebStorage)
class Bd{
    constructor(){
        let id = localStorage.getItem('id')
        
        if (id===null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId)+1
    }

    gravar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarRegistros(){
        let despesas = Array()
        
        let id = localStorage.getItem('id')

        for(let i = 1; i<= id; i++){
            let despesa =JSON.parse(localStorage.getItem(i))
            if (despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
            
        }
        return despesas
    }
    pesquisar(despesa){
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarRegistros()

        //filtro das despesas -->

        //dia
        if (despesa.dia != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //mes
        if (despesa.mes != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //ano
        if (despesa.ano != "") {          
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //tipo
        if (despesa.tipo != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descrição
        if (despesa.descricao != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if (despesa.valor != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        
        return despesasFiltradas
    }

    removerDespesa(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    let dia = document.getElementById('dia')
    let mes = document.getElementById('mes')
    let ano = document.getElementById('ano')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        dia.value,
        mes.value,
        ano.value,
        tipo.value,
        descricao.value,
        valor.value
     )


     
     if( despesa.validarDados()) {
        bd.gravar(despesa)
        console.log('dados válidos')
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById("modal_titulo").innerHTML = 'Despesa cadastrada'
        document.getElementById("modal_conteudo").innerHTML = '<h6>Despesa cadastrada com sucesso, confira na aba "Consulta"</h6>'
        document.getElementById('modal_botao').className = ' btn btn-success'
        $('#mensagemGravacao').modal('show')

        dia.value = "", mes.value = "", ano.value = "", tipo.value = "", descricao.value = "", valor.value = ""
        
     }else{
         console.log("dados inválidos")
         document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
         document.getElementById("modal_titulo").innerHTML = 'Erro de cadastro'
         document.getElementById("modal_conteudo").innerHTML = '<h6>Cadastro não realizado, faltam dados nos campos</h6>'
         document.getElementById('modal_botao').className = ' btn btn-danger'
         $('#mensagemGravacao').modal('show')
     }

}

function carregarListaDespesa(despesas = Array(), filtro = false){

    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarRegistros()
    }

    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function(d){
        let linha = listaDespesas.insertRow()
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch (d.tipo) {
            case '1': d.tipo = "Alimentação"
                break;
                case '2': d.tipo = "Educação"
                break
                case '3': d.tipo = "Lazer"
                break
                case '4': d.tipo = "Saúde"
                break
                case '5': d.tipo = "Transporte"
                break
        }
        linha.insertCell(1).innerHTML = d.tipo

        linha.insertCell(2).innerHTML = d.descricao

        linha.insertCell(3).innerHTML = `R$ ${d.valor}`

        let btnDell = document.createElement('button')
        btnDell.className = 'btn btn-danger'
        btnDell.innerHTML = '<i class="fas fa-times"></i>'
        btnDell.id = `id_despesa_${d.id}`

        btnDell.onclick = function () {
            let id = this.id.replace('id_despesa_', '')
            bd.removerDespesa(id)
            window.location.reload()
        }

        linha.insertCell(4).append(btnDell)

    })


}

function pesquisarDespesa() {
    let dia = document.getElementById('dia').value
    let mes = document.getElementById('mes').value
    let ano = document.getElementById('ano').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(dia, mes, ano, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregarListaDespesa(despesas, true)
}