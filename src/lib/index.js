import EventEmitter from 'eventemitter3';
import injectpromise from 'injectpromise';

const DEFAULT_VERSION = '1.0.0';

export default class SunWeb extends EventEmitter {

    constructor(options = false, solidityNode = false, eventServer = false, privateKey = false){
        super();
        let fullNode;
        if (typeof options === 'object' && (options.fullNode || options.fullHost)) {
            fullNode = options.fullNode || options.fullHost;
            solidityNode = options.solidityNode || options.fullHost;
            eventServer = options.eventServer || options.fullHost;
            privateKey = options.privateKey;
        } else {
            fullNode = options;
        }


        this.defaultBlock = false;
        this.defaultPrivateKey = false;
        this.defaultAddress = {
            hex: false,
            base58: false
        };

        [
            'sha3', 'toHex', 'toUtf8', 'fromUtf8',
            'toAscii', 'fromAscii', 'toDecimal', 'fromDecimal',
            'toSun', 'fromSun', 'toBigNumber', 'isAddress',
            'createAccount', 'address', 'version'
        ].forEach(key => {
            this[key] = SunWeb[key];
        });

        this.fullnodeVersion = DEFAULT_VERSION;
        this.injectPromise = injectpromise(this);
    }

}