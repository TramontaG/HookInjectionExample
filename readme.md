# Essa é uma POC criada para demonstrar como podemos criar componentes React Native (ou React) que sejam testáveis.

## Motivação:
Os testes de componentes já existem. O problema é que para testar o seu comportamento, é necessário renderizá-los em interagir simulando cliques ou tecladas.  A escrita dos testes é verbosa, pouco intuitiva, os testes são demorados e consomem bem mais processamento que o necessário. 

## Solução: 
Criar uma abstração que desacopla a lógica de funcionamento do componente do seu render, para que ela possa ser testada separadamente.

# Exemplo
Usarei como exemplo um componente simples de contagem. Ele atende os seguintes requisitos:
 - Contador inicia em 0
 - Pode ser incrementado ou decrementado
 - Números negativos são permitidos
 - Ao chegar no número 10 o contador deve ser reiniciado para 0
 - Ele deve informar se o número é par ou ímpar
 - Deve possuir funcionalidade de navegar para outras páginas do sistema

Esse componente parece simples, mas ele tem várias peculiaridades:
 - estado interno;
 - estado derivado (par ou ímpar é derivado do valor);
 - navegação do React-Navigation;
 - useEffect;
 - renderização condicional;

## Modelo padrão de desenvolvimento:

A primeira coisa a se fazer é criar um estado para o contador
 
``` typescript
const [value, setValue] = useState(0);
```

Então fariamos o useEffect para resetar a contagem ao chegar a 10

``` js
useEffect(() => {
  if (value >= 10) {
    Alert.alert('Value is 10! Rolling back to 0');
    setValue(0);
  }
}, [value]);
```

E é comum (embora não seja indicado) que o restante da lógica esteja diretamente no template

``` jsx
return (
    <View>
      <Text style={styles.header}>Default version {'\n'}</Text>

      <View style={styles.controlsContainer}>

      {/*Incremento/Decremento: Lógica declarada no template*/}
      <TouchableOpacity
        style={[styles.button, styles.leftButton]}
        onPress={() => setValue(currentValue => currentValue - 1)}
      >
        <Text>-</Text>
      </TouchableOpacity>

      <Text style={styles.valueLabel}>{value}</Text>

      <TouchableOpacity 
        style={[styles.button, styles.rightButton]}
        onPress={() => setValue(currentValue => currentValue + 1)}
      >
          <Text>+</Text>
       </TouchableOpacity>
      </View>

      {*/Botão para navegação entre páginas/*}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => props.navigation.navigate('Screen2')}
      >
        <Text>Go forward</Text>
      </TouchableOpacity>

      {/*Renderização condicional: Template verificando paridade do número*/}
      {value % 2 === 0 && (
        <Text style={styles.evenLabel}>Number is even</Text>
      )}

      {value % 2 !== 0 && (
        <Text style={styles.oddLabel}>Number is odd</Text>
      )}
    </View>
);
```

Isso é ruim por vários motivos. O principal é que, em componentes grandes, se algo quebrar fica complicado de saber exatamente onde foi que quebrou. A lógica está espalhada pelo componente todo e acoplada diretamente no template. Vamos resolver isso!

# Tornando mais declarativo
Vamos primeiro tirar essa verificação de pariade do nosso template. Vou criar um componente auxiliar para renderização condicional. Ele receberá apenas uma prop booleana (if). Para a prop com valor `true`, retornará `{props.children}`, para prop com valor `false` retornará `null`:

``` jsx
import React, {PropsWithChildren} from 'react';

type RenderIfProps = PropsWithChildren<{
  if: boolean;
}>;

const RenderIf = (props: RenderIfProps) => props.if ? <>{props.children}</> : null;

export default RenderIf;

```

Agora nosso template poderá ficar livre da obrigação de verificar paridade se utilizarmos esse componente da seguinte maneira: 

```jsx
const isEven = value % 2 === 0;
const isOdd = !isEven;

{...}
    <RenderIf if={isEven}>
      <Text>Number is even</Text>
    </RenderIf>

    <RenderIf if={isOdd}>
      <Text>Number is Odd</Text>
    </RenderIf>
{...}
```
Também é uma boa ideia criar funções específicas para o incremento e decremento do número e apenas referenciá-las no template em vez de declará-las lá.

```jsx
const increment = () => setValue(value => value + 1);
const decrement = () => setValue(value => value - 1);

{...}
<TouchableOpacity onPress={increment}>
   <Text>Increment</Text>
</TouchableOpacity>

<TouchableOpacity onPress={decrement}>
    <Text>Decrement</Text>
</TouchableOpacity>
{...}
```
# Solucionando de vez o problema
Agora que já retiramos toda logica do template, falta desacopla-la. Veja bem, a lógica de funcionamento do componente não está mais declarada DENTRO do template, mas está declarada JUNTO do template. É isso que devemos resolver agora.

## Custom Hooks

Os custom hooks são no React uma maneira de encapsulamento de lógica que pode ser importada em vários componentes. A ideia aqui é criar um custom hook que governará  toda a lógica do componente e injetá-la no template. Dessa maneira, o comportamento inteiro será testável porque é muito simples testar um custom hook.

Cria-se então um custom hook chamado useCounter.

```typescript
// .counter/logic/index.ts

const useCounter = (initialProps: InitialProps): Counter => {
  const [value, setValue] = useState(0);

  const increment = () => setValue(value + 1);
  const decrement = () => setValue(value - 1);

  const goBack = () => initialProps.navigation.navigate('Default');

  useEffect(() => {
    if (value >= 10) {
      Alert.alert('Value reached 10! Rolling back to 0');
      setValue(0);
    }
  }, [value]);

  const isEven = value % 2 === 0;

  return {
    value,
    increment,
    decrement,
    goBack,
    isEven,
    isOdd: !isEven,
  };
};
```
Esse hook deve ser chamado passando um valor `initialProps`. Isso porque esse componente faz navegação entre páginas, e a função de navegação vem por props do router, que é componente pai do counter. 

Exportaremos os tipos Counter (representando o objeto que é retornado do custom hook) e o tipo InitialProps (representando os valores que são necessários ser pasados para o custom hook)

``` typescript
// .counter/logic/index.ts

import {NavigationProp, ParamListBase, NavigatorScreenParams} from '@react-navigation/native';

export type Counter = {
  increment: () => void;
  decrement: () => void;
  goBack: () => void;
  value: number;
  isEven: boolean;
  isOdd: boolean;
};

export type InitialProps = {
  navigation: NavigationProp<ParamListBase>;
  route: NavigatorScreenParams<ParamListBase>;
};
```

## Injeção de lógica no template

Para fazer com que esse customHook governe o comportamento do componente, iremos usar o seguinte método:
 - Criar um componente de Render que receba props do tipo Counter (declarado acima);
 - Criar um index.tsx com um componente que receba props do tipo InitialProps (também declarado acima);
 - Chamar o hook no index passando as InitialProps
 - Destruturar o hook chamado no <Render /> (essa é a parte da injeção
 - index.tsx retorna apenas o Render.

Parece complicado mas na verdade é bem simples.

Vamos começar criando o componente de Render. Ele terá o template e a estilização do componente.

``` JSX
// .counter/render.tsx

import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Counter} from './Logic';
import RenderIf from './../../Components/Render';

const Render = (props: Counter) => (
  <View>
    <Text style={styles.header}>MyVersion</Text>

    <View style={styles.controlsContainer}>
      <TouchableOpacity
        style={[styles.button, styles.leftButton]}
        onPress={props.decrement}>
        <Text>-</Text>
      </TouchableOpacity>

      <Text style={styles.valueLabel}>{props.value}</Text>

      <TouchableOpacity
        style={[styles.button, styles.rightButton]}
        onPress={props.increment}>
        <Text>+</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity style={styles.button} onPress={props.goBack}>
      <Text>Go Back</Text>
    </TouchableOpacity>

    <RenderIf if={props.isEven}>
      <Text style={styles.evenLabel}>Even</Text>
    </RenderIf>

    <RenderIf if={!props.isEven}>
      <Text style={styles.oddLabel}>Odd</Text>
    </RenderIf>
  </View>
);

const styles = StyleSheet.create({
  header: {fontSize: 20, fontWeight: 'bold'},
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#BBB',
    elevation: 5,
    borderRadius: 4,
    minWidth: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  leftButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  evenLabel: {
    color: 'green',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  oddLabel: {
    color: 'blue',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  valueLabel: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#BBB',
    borderRightWidth: 0,
    borderLeftWidth: 0,
    paddingHorizontal: 8,
  },
});

export default Render;
```
No arquivo `index.tsx` iremos importar o Render e o nosso Custom Hook. Então exportaremos um componente que recebe InitialProps e retorna o Render com o useCounter destruturado.

``` jsx
import React from 'react';
import Render from './render';
import useCounter, {InitialProps} from './Logic';

const CounterComponent = (initialProps: InitialProps) => 
  <Render {...useCounter(initialProps)} />;

export default CounterComponent;
```

# Testando!

O objetivo disso tudo era conseguir testar o componente sem precisar renderizá-lo na tela. Pois bem, agora podemos usar uma biblioteca simples de teste de hooks para isso!

Veja no exemplo:

``` typescript
// ./counter/logic/test.spec.ts

import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from '../Logic';

describe("SampleTest", () => {
    const getFreshCounter = () => renderHook(useCounter);

    it("should start with 0", () => {
        const counter = getFreshCounter();
        expect(counter.result.current.value).toBe(0);
    });

    it("should increment value", async () => {
        const counter = getFreshCounter();

        act(() => {
            counter.result.current.increment();
        })

        expect(counter.result.current.value).toBe(1);
    });

    it ("should not get to 10", () => {
        const counter = getFreshCounter();

        for (let i = 0; i < 15; i++){
            act(() => {
                counter.result.current.increment();
            });

            expect(counter.result.current.value).toBeLessThan(10);
        }
    });

    it ("should be able to go negative", () => {
        const counter = getFreshCounter();

        act(() => {
            counter.result.current.decrement();
        });

        expect(counter.result.current.value).toBeLessThan(0);
    });

    it ("should be able to tell if a number is odd or even", () => {
        const counter = getFreshCounter();

        for (let i = 0; i < 15; i++){
            act(() => {
                counter.result.current.increment();
            });

            expect(counter.result.current.isEven).toBe(counter.result.current.value % 2 === 0);
            expect(counter.result.current.isOdd).toBe(counter.result.current.value % 2 === 1);
        }
    });
})
```
Considerando que você configurou seu ambiente de testes corretamente (o que está fora do escopo dessa wiki), seus resultados devem se parecer um pouco com isso:

![image.png](/.attachments/image-c3cf0cef-87db-439f-8072-e471277c0ec1.png)
