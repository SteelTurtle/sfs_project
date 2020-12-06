# Simple File Service

> Prototype for a minimalistic online file management system.

![Python-Version]
![Django-Version]
![Angular-Version]

Simple File Service (SFS) distribution consists of 4 Docker containers:

* a backend service made with **Django 3.1** and the [django rest framework][drf], providing the REST Api endpoints for
  create, retrieve and delete operations.
* a PostgresSQL 12 server, hosting the Django configuration database
* a front-end web application made with **Angular**, serving as the main client for the file service
* a **Nginx** proxy server hosting all the static content uploaded by the clients and mediating all the communications
  between the web application, the server and the external client requests
* In addition, SFS can be used with a command line tool called `sfs_cli` (located in the `sfs_project/sfs_cli`
  directory); the CLI supports the same operations of the front-end web application, minus the possibility to upload
  multiple files to the server in one batch.

## How to run SFS

#### Linux, Windows & OS X:

The main prerequisite to run the SFS services on any platform, is to have a working installation of [Docker][Docker]
and [docker-compose][docker-compose]. The process to start SFS is identical for any of the three main OSs; from the root
directory of the `sfs_project`
just run:

```sh
docker-compose up -d --build
```

_Notice that the first run of this command may take several minutes, as the containers and all their dependencies must
be downloaded and configured._

## Usage example

Once the 4 containers of SFS are up and operational, there are 3 ways to interact with the service:

### Direct interaction with the REST Api

The domain managed by the Api is a "File", a simple entity consisting of:

    * a numeric Id
    * a virtual directory path pointing to the binary file location
    * a timestamp indicating when the file was uploaded to the server.

Given this model, here is what can be done with the Api:

* Get the list of files currently hosted by the server as a JSON array:

```sh
curl -s GET http://localhost:8080/api/files | json_pp
```

* Get (Download) a specific file hosted on the server: this requires a direct request to the `MEDIA` URI path where the
  file is actually stored, and the exact ID of the file to be downloaded. These properties of the File can be retrieved
  with the command above. Once you have the Id of the file you want to download, you can input:

```sh
curl http://localhost:8080/media/<FILE_NAME>  > some_new_file
```

* Upload a file to the SFS server:

```sh
curl -X POST -F 'file=@<FILE_TO_UPLOAD>' http://localhost:8080/api/files
```

* Delete a file from the SFS server. For this, you need the file id first. Once you get it, you can type:

```sh
curl -X DELETE http://localhost:8080/api/files/<FILE_ID>
```

### Using the SFS web application client

The easiest and most straightforward way to use SFS is by the Angular web app available at http://localhost:8080
The web client also supports uploads of multiple files in a single operation. The server accept files of any format,
with the only constraint being that the max size for each accepted file is set to 20 MBytes

### Using the SFS command line tool

The command line tool `sfs_client` requires Python 3 and can be invoked like any normal Python script from the shell:

```sh
$>python sfs_cli.py

usage: sfs_cli.py [-h] [-c COMMAND] -u URL [-id ID] [-f FILE]
sfs_cli.py: error: the following arguments are required: -u/--url
```

The tool can be used as an alternative way to get, upload or delete files hosted on the SFS server.

* Get all files on the server, together with their file id:

```sh
$>python sfs_cli.py -c GET -u http://localhost:8080/api/files

Retrieving files stored on server at http://localhost:8080...
| ID |         FILE          |
_____________________________
104   Modern_Java_in_Action_4sqda6g.pdf
106   Software_Development_Metrics_NCaWDAv.pdf
107   Software_Architecture_in_Practice_-_3rd_Edition_HgPZHDn.pdf
108   Programming_Rust_Gurvipv.pdf
109   Programming_In_Scala_-_4th_Edition_O4DPs3d.pdf
110   Software_Architecture_in_Practice_-_3rd_Edition_iwPvzSC.pdf
```

* Upload a file on the server:

```sh
$>python sfs_cli.py -c POST -u http://localhost:8080/api/files -f <FILE_TO_UPLOAD>
```

* Delete a file from the server:

```sh
$>python sfs_cli.py -c DELETE -u http://localhost:8080/api/files -i <FILE_ID>
```

## Release History

* 0.0.1
  * Work in progress

## Meta

Author – [DannyBoy](https://www.linkedin.com/in/dannyboy/) – Feel free to get in touch!

This repository is freely redistributable and not subject to any license.

<!-- Markdown link & img dfn's -->

[Django-Version]: https://img.shields.io/static/v1?label=Django&message=v3.1&color=yellow&style=flat-square

[Python-Version]: https://img.shields.io/static/v1?label=Python&message=v3.9&color=green&style=flat-square

[Angular-Version]: https://img.shields.io/static/v1?label=Angular&message=v11&color=red&style=flat-square

[drf]: https://www.django-rest-framework.org/

[Docker]: https://docs.docker.com/engine/install/

[docker-compose]: https://docs.docker.com/compose/install/
