# Magé Verde — aplicativo mobile

O app exibe lugares turísticos de Magé, com horário sugerido para visita, localização,
descrição e foto. Ele usa Expo + React Native + TypeScript. Os componentes de interface ficam em
`components/ui` e são gerados pelo `react-native-reusables`, com NativeWind para
os estilos utilitários.

<p>
  <!-- iOS -->
  <a href="https://itunes.apple.com/app/apple-store/id982107779">
    <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  </a>
  <!-- Android -->
  <a href="https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=blankexample">
    <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  </a>
  <!-- Web -->
  <a href="https://docs.expo.dev/workflow/web/">
    <img alt="Supports Expo Web" longdesc="Supports Expo Web" src="https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff" />
  </a>
</p>

## Launch your own

[![Launch with Expo](https://github.com/expo/examples/blob/master/.gh-assets/launch.svg?raw=true)](https://launch.expo.dev/?github=https://github.com/expo/examples/tree/master/blank)

## 🚀 How to use

- Instale as dependências com `pnpm install`.
  - If you have native iOS code run `npx pod-install`
- Rode `pnpm start` para iniciar o bundler.
- Open the project in a React runtime to try it:
  - iOS: [Client iOS](https://itunes.apple.com/app/apple-store/id982107779)
  - Android: [Client Android](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=blankexample)
  - Web: Any web browser

### Conexão com o backend

Durante o desenvolvimento, o app usa a porta `3333` do backend. No celular físico,
deixe o computador e o aparelho na mesma rede Wi-Fi e faça um reload do Expo Go após
iniciar o bundler. Se `EXPO_PUBLIC_API_URL` estiver apontando para `localhost`, o app
substitui esse host pelo endereço do computador informado pelo Expo. Em uma build fora
do desenvolvimento, configure `EXPO_PUBLIC_API_URL` com uma URL acessível pelo aparelho.

### Componentes de interface

Para adicionar outro componente Reusables, use a CLI dentro desta pasta:

```bash
pnpm dlx @react-native-reusables/cli@latest add <componente> --yes
```

Os componentes gerados usam os aliases `@/components` e `@/lib/utils`.

## Running/Modifying Native Code

You can generate native iOS and Android projects from your Expo config file (**app.json**/ **app.config.js**) by runnning `npx expo prebuild`. These native projects can then be compiled and run via XCode and Android Studio.

> 💡 Learn more about [native code in Expo](https://docs.expo.dev/workflow/customizing/)

## Publishing

- Deploy the native app to the App store and Play store using this guide: [Deployment](https://docs.expo.dev/distribution/app-stores/).
- Deploy the website using this guide: [Web deployment](https://docs.expo.dev/distribution/publishing-websites/).

## 📝 Notes

- Learn more about [Universal React](https://docs.expo.dev/).
- See what API and components are [available in the React runtimes](https://docs.expo.dev/versions/latest/).
- Find out more about developing apps and websites: [Guides](https://docs.expo.dev/guides/).
