export const es = {
  common: {
    start: `Este bot puede obtener tiempos de llegadas de buses TMB (test).
Escribe /ayuda para una lista de opciones disponibles.`,
    help: `Escribe un código de parada directamente.
Guarda una parada favorita con /guardar.
Lista tus favoritos con /favoritos.
Borra una parada favorita con /borrar.
Cancela una operación con /cancelar.`,
    notRegistered: `Tu usuario no está registrado; contacta con el administrador del bot.`,
    aliasMustBeText: `Escríbeme el alias como mensaje de texto.`,
    askStopCode: `¿Cuál es el código de parada?`,
    codeMustBeText: `Escríbeme el código como mensaje de texto.`,
    cancelled: `Operación cancelada.`,
    askAlias: `¿Cuál es el alias de la parada?`,
    favoriteNotFound: `Ese favorito no existe.`,
    noFavoritesLeft: `No queda ningún favorito.`,
    deleteAnotherFavorite: `¿Quieres borrar otro favorito?`,
    noDataForStop: `Esta parada no tiene líneas con datos ahora mismo.`,
    noFavoritesSaved: `No tienes ningún favorito guardado.`,
    chooseFavoriteToDelete: `Elige qué favorito quieres borrar.`,
    notUnderstood: `No he entendido tu mensaje.`,
    unexpectedError: `Ha ocurrido un error no previsto.`,
  },
  templates: {
    favoriteSaved: (alias: string, code: string) =>
      `Favorito guardado: "${alias}" (parada ${code}).`,
    line: (lineName: string, arrivalTimesText: string) =>
      `Línea ${lineName}: ${arrivalTimesText}`,
  },
};

export const ca: typeof es = {
  common: {
    start: `Aquest bot pot consultar els temps d'arribada dels autobusos de TMB.
Escriu /ayuda per veure la llista d'opcions disponibles.`,
    help: `Escriu un codi de parada directament.
Desa una parada com a favorita amb /guardar.
Llista els teus favorits amb /favoritos.
Esborra una parada favorita amb /borrar.
Cancel·la una operació amb /cancelar.`,
    notRegistered: `El teu usuari no està registrat; contacta amb l'administrador del bot.`,
    aliasMustBeText: `Escriu-me l'àlies com a missatge de text.`,
    askStopCode: `Quin és el codi de la parada?`,
    codeMustBeText: `Escriu-me el codi com a missatge de text.`,
    cancelled: `Operació cancel·lada.`,
    askAlias: `Quin és l'àlies de la parada?`,
    favoriteNotFound: `Aquest favorit no existeix.`,
    noFavoritesLeft: `No queda cap favorit.`,
    deleteAnotherFavorite: `Vols esborrar un altre favorit?`,
    noDataForStop: `Aquesta parada no té línies amb dades ara mateix.`,
    noFavoritesSaved: `No tens cap favorit guardat.`,
    chooseFavoriteToDelete: `Tria quin favorit vols esborrar.`,
    notUnderstood: `No he entès el teu missatge.`,
    unexpectedError: `S'ha produït un error no previst.`,
  },
  templates: {
    favoriteSaved: (alias: string, code: string) =>
      `Favorit guardat: "${alias}" (parada ${code}).`,
    line: (lineName: string, arrivalTimesText: string) =>
      `Línia ${lineName}: ${arrivalTimesText}`,
  },
};

export const en: typeof es = {
  common: {
    start: `This bot can check TMB bus arrival times.
Type /ayuda for a list of available options.`,
    help: `Type a stop code directly.
Save a favorite stop with /guardar.
List your favorites with /favoritos.
Delete a favorite stop with /borrar.
Cancel an operation with /cancelar.`,
    notRegistered: `Your user is not registered; contact the bot administrator.`,
    aliasMustBeText: `Send me the alias as a text message.`,
    askStopCode: `What's the stop code?`,
    codeMustBeText: `Send me the code as a text message.`,
    cancelled: `Operation cancelled.`,
    askAlias: `What's the alias for the stop?`,
    favoriteNotFound: `That favorite doesn't exist.`,
    noFavoritesLeft: `No favorites left.`,
    deleteAnotherFavorite: `Do you want to delete another favorite?`,
    noDataForStop: `This stop has no lines with data right now.`,
    noFavoritesSaved: `You don't have any favorites saved.`,
    chooseFavoriteToDelete: `Choose which favorite you want to delete.`,
    notUnderstood: `I didn't understand your message.`,
    unexpectedError: `An unexpected error has occurred.`,
  },
  templates: {
    favoriteSaved: (alias: string, code: string) =>
      `Favorite saved: "${alias}" (stop ${code}).`,
    line: (lineName: string, arrivalTimesText: string) =>
      `Line ${lineName}: ${arrivalTimesText}`,
  },
};
