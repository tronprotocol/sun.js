import utils from 'helper';
import {ADDRESS_PREFIX} from 'helper/address';

const baseMethods = {
    address() {
        return {
            fromHex(address) {
                if (!utils.isHex(address))
                    return address;

                return utils.crypto.getBase58CheckAddress(
                    utils.code.hexStr2byteArray(address.replace(/^0x/, ADDRESS_PREFIX))
                );
            },
            toHex(address) {
                if (utils.isHex(address))
                    return address.toLowerCase().replace(/^0x/, ADDRESS_PREFIX);

                return utils.code.byteArray2hexStr(
                    utils.crypto.decodeBase58Address(address)
                ).toLowerCase();
            },
            fromPrivateKey(privateKey) {
                try {
                    return utils.crypto.pkToAddress(privateKey);
                } catch {
                    return false;
                }
            }
        }
    },

    sha3(string, prefix = true) {
        return (prefix ? '0x' : '') + utils.ethersUtils.keccak256(Buffer.from(string, 'utf-8')).toString().substring(2);
    },

    toHex(val) {
        if (utils.isBoolean(val))
            return TronWeb.fromDecimal(+val);

        if (utils.isBigNumber(val))
            return TronWeb.fromDecimal(val);

        if (typeof val === 'object')
            return TronWeb.fromUtf8(JSON.stringify(val));

        if (utils.isString(val)) {
            if (/^(-|)0x/.test(val))
                return val;

            if (!isFinite(val))
                return TronWeb.fromUtf8(val);
        }

        let result = TronWeb.fromDecimal(val);
        if (result === '0xNaN') {
            throw new Error('The passed value is not convertible to a hex string');
        } else {
            return result;
        }
    },

    toUtf8(hex) {
        if (utils.isHex(hex)) {
            hex = hex.replace(/^0x/, '');
            return Buffer.from(hex, 'hex').toString('utf8');
        } else {
            throw new Error('The passed value is not a valid hex string');
        }
    },

    fromUtf8(string) {
        if (!utils.isString(string)) {
            throw new Error('The passed value is not a valid utf-8 string')
        }
        return '0x' + Buffer.from(string, 'utf8').toString('hex');
    },

    toAscii(hex) {
        if (utils.isHex(hex)) {
            let str = "";
            let i = 0, l = hex.length;
            if (hex.substring(0, 2) === '0x') {
                i = 2;
            }
            for (; i < l; i += 2) {
                let code = parseInt(hex.substr(i, 2), 16);
                str += String.fromCharCode(code);
            }
            return str;
        } else {
            throw new Error('The passed value is not a valid hex string');
        }
    },

    fromAscii(string, padding) {
        if (!utils.isString(string)) {
            throw new Error('The passed value is not a valid utf-8 string')
        }
        return '0x' + Buffer.from(string, 'ascii').toString('hex').padEnd(padding, '0');
    },


    toDecimal(value) {
        return TronWeb.toBigNumber(value).toNumber();
    },

    fromDecimal(value) {
        const number = TronWeb.toBigNumber(value);
        const result = number.toString(16);

        return number.isLessThan(0) ? '-0x' + result.substr(1) : '0x' + result;
    },

    fromSun(sun) {
        const trx = TronWeb.toBigNumber(sun).div(1_000_000);
        return utils.isBigNumber(sun) ? trx : trx.toString(10);
    },

    toSun(trx) {
        const sun = TronWeb.toBigNumber(trx).times(1_000_000);
        return utils.isBigNumber(trx) ? sun : sun.toString(10);
    },

    toBigNumber(amount = 0) {
        if (utils.isBigNumber(amount))
            return amount;

        if (utils.isString(amount) && /^(-|)0x/.test(amount))
            return new BigNumber(amount.replace('0x', ''), 16);

        return new BigNumber(amount.toString(10), 10);
    },

    isAddress(address = false) {
        if (!utils.isString(address))
            return false;

        // Convert HEX to Base58
        if (address.length === 42) {
            try {
                return TronWeb.isAddress(
                    utils.crypto.getBase58CheckAddress(
                        utils.code.hexStr2byteArray(address) // it throws an error if the address starts with 0x
                    )
                );
            } catch (err) {
                return false;
            }
        }
        try {
            return utils.crypto.isAddressValid(address);
        } catch (err) {
            return false;
        }
    },

    async createAccount() {
        return utils.accounts.generateAccount();
    }
}

export default function (instance) {
    for(let name of baseMethods){
        instance[name] = baseMethods[name].call(instance);
    }
}