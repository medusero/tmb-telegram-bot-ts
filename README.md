# Sencillo bot de telegram para la API de TMB
Como el encabezado reza, es un simplísimo bot para recibir horarios de llegada de las paradas de Transports Metropolitans de Barcelona).  
Está pensado como bot personal, así que todos los handlers filtran para responder solo al usuario autorizado.
## Requisitos previos
- Docker o Podman, según el modo de despliegue que prefieras.
- Una API de TMB: Se obtiene creando una cuenta (gratuita) en [developer.tmb.cat](https://developer.tmb.cat).
- Una cuenta (gratuita) de Telegram y crear un bot con [BotFather](https://telegram.me/BotFather).

El bot solo hace peticiones salientes (long polling a Telegram + llamadas a la API de TMB), así que no hace falta exponer ningún puerto.  

La imagen se construye sobre una base [distroless](https://github.com/GoogleContainerTools/distroless) (variante `nonroot`): sin shell ni gestor de paquetes dentro del contenedor, y corre con el usuario sin privilegios `nonroot` que trae esa imagen por convención (UID/GID `65532`).
## Despliegue
### Docker
Clona el repositorio en local y construye la imagen.  
Copia el `.env.example` a tu directorio de trabajo. Para este ejemplo pongamos que es `$HOME/bot`.  
Rellena los datos del `.env` para `TMB_APP_ID`, `TMB_APP_KEY`, `TELEGRAM_BOT_TOKEN` y `TELEGRAM_USER_ID`.   
Crea el directorio de montaje, de lo contrario Docker lo crearía como root en el despliegue, y el servicio (que corre con `uid 65532`) no podría escribir nada en él.
```
mkdir $HOME/bot
git clone https://github.com/medusero/tmb-telegram-bot-ts.git
cd tmb-telegram-bot-ts
docker build -t tmb-bot .
cp .env.example $HOME/bot/.env
cd $HOME/bot/
chmod 600 .env
mkdir data
chown 65532:65532 data
```
#### Con el comando docker a pelo
Puesto que ya hemos construido la imagen previamente lo podemos lanzar sin build:
```
docker run -d --name tmb-bot --env-file .env -v ./data:/app/data --restart unless-stopped tmb-bot
```
#### Con Docker Compose
Crea el archivo `$HOME/bot/compose.yaml` con este contenido:
```yaml
services:
    tmb-bot:
        container_name: tmb-bot
        env_file:
            - .env
        volumes:
            - ./data:/app/data
        restart: unless-stopped
        image: tmb-bot
```
Desde el directorio `$HOME/bot`:
```
docker compose up -d
```
### Podman
Igual que con Docker, pero ojo si vas rootless: la imagen corre con `uid 65532` dentro del contenedor, y ese UID no mapea automáticamente al dueño del directorio del host, aunque este también use ese UID. Lo arreglamos con `podman unshare`.
```
mkdir $HOME/bot
git clone https://github.com/medusero/tmb-telegram-bot-ts.git
cd tmb-telegram-bot-ts
podman build -t tmb-bot .
cp .env.example $HOME/bot/.env
cd $HOME/bot/
chmod 600 .env
mkdir data
podman unshare chown 65532:65532 data
```
#### Con el comando podman a pelo
```
podman run -d --name tmb-bot --env-file .env -v ./data:/app/data:Z --restart unless-stopped tmb-bot
```
#### Como quadlet bajo systemd
Crea el archivo `$HOME/.config/containers/systemd/tmb-bot.build` con este contenido (sustituye `RUTA_AL_REPO_CLONADO` por la ruta real donde dejes el repositorio clonado de forma permanente en el servidor):
```ini
[Build]
ImageTag=localhost/tmb-bot:latest
File=Containerfile
SetWorkingDirectory=RUTA_AL_REPO_CLONADO
```

Crea el archivo `$HOME/.config/containers/systemd/tmb-bot.container` con este contenido:
```ini
[Container]
NoNewPrivileges=true
ContainerName=tmb-bot
Image=tmb-bot.build
EnvironmentFile=%h/bot/.env
DropCapability=all
Volume=%h/bot/data:/app/data:Z

[Service]
MemoryMax=128M

[Install]
WantedBy=default.target
```
Luego carga el demonio y lanza el servicio:
```
systemctl --user daemon-reload
systemctl --user start tmb-bot.service
```
