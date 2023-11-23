create database dindin;

create table usuarios(
  
  id serial not null unique primary key,
  nome text,
  email text unique,
  senha text
  );
  
    
  create table categorias(
    id serial not null unique primary key,
    descricao text not null
    );
    
  
  create table transacoes(
    id serial not null unique primary key,
    descricao text,
    valor integer,
    data timestamp,
    categoria_id serial references categorias(id),
    usuario_id serial references usuarios(id),
    tipo text
    );
    
    
insert into categorias (descricao) values
    ('Alimentação'),
    ('Assinaturas e Serviços'),
    ('Casa'),
    ('Mercado'),
    ('Cuidados Pessoais'),
    ('Educação'),
    ('Família'),
    ('Lazer'),
    ('Pets'),
    ('Presentes'),
    ('Roupas'),
    ('Saúde'),
    ('Transporte'),
    ('Salário'),
    ('Vendas'),
    ('Outras Receitas'),
    ('Outras Despesas');

