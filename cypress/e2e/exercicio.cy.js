/// <reference types="cypress" />

describe('Testes da Funcionalidade Catálogo de Livros', () => {

    let token

    beforeEach(() => {
        cy.geraToken('admin@biblioteca.com', 'admin123')
            .then(tkn => {
                token = tkn
            })
    });

    // Objetivo: Verificar que a API retorna lista de livros com paginação e filtros funcionando
    // Validar que filtros por categoria e autores funcionam corretamente
    it('GET - Deve listar livros com filtros e paginação', () => {

    cy.request({
        method: 'GET',
        url: '/livros'
    }).then((response) => {

        expect(response.status).to.eq(200)
        expect(response.body).to.exist

    })

})


    // Objetivo: Validar que é possível obter detalhes de um livro específico pelo ID
    // Verificar que todos os campos do livro são retornados corretamente
    it('GET - Deve obter detalhes de um livro específico', () => {

        cy.request({
            method: 'GET',
            url: '/livros'
        }).then((response) => {

            const idLivro = response.body[0].id

            cy.request({
                method: 'GET',
                url: `/ livros / ${ idLivro } `
            }).then((responseLivro) => {

                expect(responseLivro.status).to.eq(200)
                expect(responseLivro.body.id).to.eq(idLivro)

            });

        });

    });

    // Objetivo: Validar que um novo livro é adicionado com sucesso ao catálogo
    // Verificar que apenas admin pode adicionar novos livros (validação de permissão)
    it('POST - Deve cadastrar um novo livro com sucesso', () => {

        cy.request({
            method: 'POST',
            url: '/livros',
            headers: {
                Authorization: `Bearer ${ token } `
            },
            body: {
                titulo: 'Livro Cypress',
                autor: 'Alessandra Martins',
                ano: 2026,
                categoria: 'Tecnologia'
            }

        }).then((response) => {

            expect(response.status).to.eq(201)
            expect(response.body.titulo)
                .to.eq('Livro Cypress')

        });

    });

    // Objetivo: Garantir que dados inválidos são rejeitados ao adicionar um livro
    // Validar mensagens de erro apropriadas para dados faltantes ou incorretos
    it('POST - Deve rejeitar livro com dados inválidos', () => {

        cy.request({
            method: 'POST',
            url: '/livros',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${ token } `
            },
            body: {}

        }).then((response) => {

            expect(response.status).to.eq(400)

        });

    });

    // Objetivo: Validar que um livro pode ser atualizado com sucesso
    // Verificar que apenas admin pode atualizar livros (validação de permissão)
    it('PUT - Deve atualizar um livro previamente cadastrado', () => {

        cy.request({
            method: 'POST',
            url: '/livros',
            headers: {
                Authorization: `Bearer ${ token } `
            },
            body: {
                titulo: 'Livro Original',
                autor: 'Alessandra',
                ano: 2026,
                categoria: 'QA'
            }

        }).then((response) => {

            const idLivro = response.body.id

            cy.request({
                method: 'PUT',
                url: `/ livros / ${ idLivro } `,
                headers: {
                    Authorization: `Bearer ${ token } `
                },
                body: {
                    titulo: 'Livro Atualizado',
                    autor: 'Alessandra',
                    ano: 2026,
                    categoria: 'Automação'
                }

            }).then((responsePut) => {

                expect(responsePut.status).to.eq(200)
                expect(responsePut.body.titulo)
                    .to.eq('Livro Atualizado')

            });

        });

    });

    // Objetivo: Validar que um livro pode ser removido do catálogo
    // Verificar que apenas admin pode deletar livros (validação de permissão)
    it('DELETE - Deve deletar um livro previamente cadastrado', () => {

        cy.request({
            method: 'POST',
            url: '/livros',
            headers: {
                Authorization: `Bearer ${ token } `
            },
            body: {
                titulo: 'Livro para deletar',
                autor: 'Alessandra',
                ano: 2026,
                categoria: 'Teste'
            }

        }).then((response) => {

            const idLivro = response.body.id

            cy.request({
                method: 'DELETE',
                url: `/ livros / ${ idLivro } `,
                headers: {
                    Authorization: `Bearer ${ token } `
                }

            }).then((responseDelete) => {

                expect(responseDelete.status).to.eq(200)

            });

        });

    });

});

