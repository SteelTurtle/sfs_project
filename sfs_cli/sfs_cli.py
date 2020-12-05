#!/usr/bin/env python3
import argparse
import logging
import sys
import urllib.parse

import requests

logger = logging.getLogger('SFS_CLI_LOGGER:   ')
logger.setLevel(logging.DEBUG)
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.ERROR)
log_format = logging.Formatter('[%(asctime)s] %(levelname)-8s %(name)-12s %(message)s')
console_handler.setFormatter(log_format)
logger.addHandler(console_handler)

parser = argparse.ArgumentParser()
parser.add_argument('-c', '--command',
                    type=str,
                    default='GET',
                    help='HTTP verb used to call the  API endpoint. GET | POST | DELETE are '
                         'supported. If not specified, default will be GET')
parser.add_argument('-u', '--url', required=True, help='URL of the file server API endpoint')
parser.add_argument('-id', '--id', type=str, help='Numeric id of the file to download')
parser.add_argument('-f', '--file', type=str, help='name of file to upload on the remote server')
args = vars(parser.parse_args())

http_verb = args['command']
api_url = args['url']
file_id = args['id']
file_name = args['file']
url_parsed = urllib.parse.urlsplit(api_url)
url_base = url_parsed.scheme + '://' + url_parsed.netloc

if file_id is not None and http_verb == 'GET':
    try:
        val = int(file_id)
    except ValueError:
        logger.error('The "id" field must be a int!')
        exit(1)
    api_response = requests.get(api_url + '/' + file_id)
    status_code = api_response.status_code
    if status_code != 200:
        logger.error('File with id ' + file_id + " doesn't seem to exist. Please verify that the "
                                                 "file with the selected id is on the server.")
        exit(1)
    file_path = api_response.json()['file']
    file_name = file_path.split('/')[-1]
    print('Downloading file ' + file_name + '...')
    file_url_response = requests.get(url_base + file_path)
    with open(file_name, 'wb') as output_file:
        output_file.write(file_url_response.content)
    print('Download completed.')

elif http_verb == 'GET':
    api_response = requests.get(api_url)
    print('Retrieving files stored on server at ' + url_base + '...')
    files = api_response.json()
    print('| ID |         FILE          |')
    print('_____________________________')
    [print('{:<6}{}'.format(file['id'], file['file'].split('/')[-1])) for file in files]

elif file_name is not None and http_verb == 'POST':
    try:
        file = {'file': open(file_name, 'rb')}
        response = requests.post(api_url, files=file)
        print('File "{}" has been uploaded to the server. The file ID is {}'.format(
            file_name.split('/')[-1],
            response.json()['id'])
        )
    except FileNotFoundError:
        logger.error('The selected file does not seem to exist. Cannot upload to server.')
        exit(1)

elif file_id is not None and http_verb == 'DELETE':
    try:
        val = int(file_id)
    except ValueError:
        logger.error('The "id" field must be a int!')
        exit(1)
    api_response = requests.delete(api_url + '/' + file_id)
    status_code = api_response.status_code
    if status_code == 204:
        print('File with ID ' + file_id + 'successfully deleted.')
    elif status_code == 404:
        logger.error(
            'There seems not to be any file with id ' + file_id + " on the server. Cannot "
                                                                  "delete anything..."
        )
else:
    logger.error(
        "I'm sorry Dave, I'm afraid I can't do that...\n" +
        'Wrong command syntax or, some of the parameters specified are incorrect.' +
        'Check the correct usage with "python sfs_cli --help"'
    )
    exit(1)
