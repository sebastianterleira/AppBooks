const checkIsViewTransition = () => {
  return Boolean(document.startViewTransition);
};

const fetchPage = async (url) => {
  // vamos a cargar la pagina de destino
  // utilizando un fetch para obtener el html

  const response = await fetch(url); // clean-code
  const text = await response.text();
  // quedarnos  sólo con el contenido del html dentro de la etiqueta body
  // usamos un regex para extraer el contenido

  const [, data] = text.match(/<body>([\s\S]*)<\/body>/i);
  return data;
};

export const startViewTransitionUtil = () => {
  if (!checkIsViewTransition()) return;

  window.navigation.addEventListener("navigate", (e) => {
    const toUrl = new URL(e.destination.url);

    // es una pagina externa ? si es asi, lo ignoramos

    if (location.origin !== toUrl.origin) return;

    // si es una navagacion en el mismo dominio (origen)

    e.intercept({
      async handler() {
        const data = await fetchPage(toUrl.pathname);
        // utilizar la api de View Transition API
        document.startViewTransition(() => {
          // como tiene que actualizar la vista
          document.body.innerHTML = data;
          document.documentElement.scrollTop = 0;
        });
      },
    });
  });
};
