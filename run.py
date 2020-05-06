import os
import sys
import getopt
import argparse
import http.server
import socketserver
import threading

########################################################################
#
#  This file handles building and serving app in Google Chrome on Mac.
#  By default, opens the app in Chrome kiosk mode with a timeout of 10 mins.
#
#  Usage: python run.py
#
#  Flags:
#  -b <True/False>
#  If True, create fresh build, else use existing. Defaults to False.
#
#  -k <True/False>
#  If True, kiosk mode is true: opens app in Chrome in kiosk mode and
#  disables mouse cursor and hotkeys. Otherwise, opens app in normal
#  Chrome and enables mouse and hot key interaction. Defaults to True.
#
#  -p <Number>
#  Port number for server, defaults to 8000.
#
#  -t <Number>
#  Number of minutes for timeout that returns app to sleep/demo mode.
#
########################################################################
PORT = 8000


# Start a local server that forwards requests to a given folder path. From: https://stackoverflow.com/questions/39801718/how-to-run-a-http-server-which-serves-a-specific-path
def handler_from(directory):
    def _init(self, *args, **kwargs):
        return http.server.SimpleHTTPRequestHandler.__init__(self, *args, directory=self.directory, **kwargs)
    return type(f'HandlerFrom<{directory}>',
                (http.server.SimpleHTTPRequestHandler,),
                {'__init__': _init, 'directory': directory})


# Start a local server
def create_server(port):
    with socketserver.TCPServer(('', port), handler_from('build')) as httpd:
        print('serving at port', port)
        httpd.serve_forever()


# Start a local server and open Chrome pointing at that server
def run(is_kiosk_mode, port):
    # Start server in separate thread (does not get cleaned up nicely...)
    threading.Thread(target=create_server, args=(port,)).start()

    if is_kiosk_mode:
        os.system('/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk --app=http://localhost:' + str(port) + '/')
    else:
        os.system('/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --app=http://localhost:' + str(port) + '/')


# Recompile the project with the given settings
def build():
    # run build scripts
    os.system('npm run build')


# Update the file that stores the flags for the app.
def update_flags(is_kiosk_mode, timeout):
    # Write to flags file after build
    file_out = open('./build/lib/flags.js', 'w')
    file_out.write('window.URBAN5_flags = {\n')
    file_out.write('  timeout: ' + str(timeout) + ', // demo timeout (in minutes)\n')
    file_out.write('  isKioskMode: ' + str(is_kiosk_mode).lower() + ', // is going to be run in kiosk mode for display (disable cursor and keyboard hot keys)\n')
    file_out.write('};\n')
    file_out.close()


# Helper for processing command line args from: https://stackoverflow.com/questions/15008758/parsing-boolean-values-with-argparse
def str2bool(v):
    if isinstance(v, bool):
        return v
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')


# Process the command line call to extract the flags
def get_flags():
    argv = sys.argv[1:]
    usage = 'run.py -build <should rebuild> -timeout <timeout length> -kiosk <is kiosk mode> -port <port number>'
    timeout = 10
    is_kiosk_mode = True
    should_rebuild = False
    port = PORT
    try:
        opts, args = getopt.getopt(argv, 'hb:t:k:p:', ['build=', 'timeout=', 'kiosk=', 'port='])
    except getopt.GetoptError:
        print(usage)
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print(usage)
            sys.exit()
        elif opt in ('-b', '--build'):
            should_rebuild = str2bool(arg)
        elif opt in ('-t', '--timeout'):
            if arg.isnumeric():
                timeout = arg
        elif opt in ('-k', '--kiosk'):
            is_kiosk_mode = str2bool(arg)
        elif opt in ('-p', '--port'):
            port = int(arg)

    return should_rebuild, is_kiosk_mode, port, timeout


if __name__ == '__main__':
    should_rebuild, is_kiosk_mode, port, timeout = get_flags()

    # compile the build folder
    if should_rebuild:
        build()

    update_flags(is_kiosk_mode, timeout)
    # start a server and launch Chrome
    run(is_kiosk_mode, port)
