<template>
  <div class="loginDivMain">
    <DialogScatter v-if="isShowDialogScatter" @close="isShowDialogScatter = false"></DialogScatter>
    <DialogPrivateKey v-if="isShowDialogPrivateKey" @close="isShowDialogPrivateKey = false" @event-keylogin="eventKeyLogin"></DialogPrivateKey>
    <DialogNoKey v-if="isShowDialogNoKey" @close="isShowDialogNoKey = false" @event-nokeylogin="eventNoKeyLogin"></DialogNoKey>
    <div class="user-title">
      {{$t("account")}}
    </div>
    <div v-if="!isLogin" class="divLogin">
      <button class="btLogin" v-text="$t('loginWithScatter')" @click="getIdentity"></button>
      <button class="btLogin" v-text="$t('loginWithKey')" @click="isShowDialogPrivateKey = true"></button>
      <button class="btLogin" v-text="$t('loginWithoutKey')" @click="isShowDialogNoKey = true"></button>
    </div>
    <div v-else class="divInfo">
      <div class="divInfoRow">
        <i class="fas fa-user bgcircle"></i>
        <span>{{$t("accountName")}}</span>
        <strong>{{ eosAccountName }}</strong>
        <b-dropdown v-if="eosAccounts.length > 1" id="ddown1" variant="link" size="sm" no-caret>
          <template slot="button-content">
            <i class="fas fa-caret-square-down caretdown"></i>
          </template>
          <b-dropdown-item v-for="account in eosAccounts" :key="account" v-text="account" @click="chgAccount(account)"></b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="divInfoRow">
        <i class="fas fa-dollar-sign bgcircle"></i>
        <span>{{$t("balance")}}</span>
        <strong>{{ tweenedEosBalance.toFixed(4)+" EOS" }}</strong>
      </div>
      <div class="divInfoRow divInfoRowPct">
        <i class="fas fa-save bgcircle" v-b-tooltip.hover :title="$t('titleRam')" @click="$emit('event-chgres',0)"></i>
        <ProgressCircle class="pctcircle" :width="45" :border="25" :fontSize="56" :setPct="ramPct" :color="pctColor(ramPct)"/>
        <!-- <span class="v2-progresscircle-text" :title="$t('titleRam')" @click="$emit('event-chgres',0)"><font>{{ramPct}}%</font><br>RAM</span> -->
        <i class="fas fa-microchip bgcircle" v-b-tooltip.hover :title="$t('titleCpu')" @click="$emit('event-chgres',1)"></i>
        <ProgressCircle class="pctcircle" :width="45" :border="25" :fontSize="56" :setPct="cpuPct" :color="pctColor(cpuPct)"/>
        <!-- <span class="v2-progresscircle-text" :title="$t('titleCpu')" @click="$emit('event-chgres',1)"><font>{{cpuPct}}%</font><br>CPU</span> -->
        <i class="fas fa-globe bgcircle" v-b-tooltip.hover :title="$t('titleNet')" @click="$emit('event-chgres',2)"></i>
        <ProgressCircle class="pctcircle" :width="45" :border="25" :fontSize="56" :setPct="netPct" :color="pctColor(netPct)"/>
        <!-- <span class="v2-progresscircle-text" :title="$t('titleNet')" @click="$emit('event-chgres',2)"><font>{{netPct}}%</font><br>NET</span> -->
      </div>
      <div class="divInfoRow">
        <button class="btLogout" @click="logout">{{$t("logout")}}</button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { eos } from "../eos.js";
import { bus } from "../bus.js";
import Comm from "../comm.js";
import Eos from "eosjs";
import { EOSNETWORK } from "../eos.js";
import DialogPrivateKey from "./DialogPrivateKey";
import DialogScatter from "./DialogScatter";
import DialogNoKey from "./DialogNoKey";
import ProgressCircle from "./ProgressCircle";
import ProgressBar from "./ProgressBar";
import { OFFICIALACCOUNTNAME } from "../comm.js";
import ecc from "eosjs-ecc";
// Set up any extra options you want to use eosjs with.
const eosOptions = {
  chainId: EOSNETWORK.chainId
};

const requiredFields = {
  accounts: [{ blockchain: EOSNETWORK.blockchain, chainId: EOSNETWORK.chainId }]
};

function strToAsset(str) {
  var amount = parseFloat(str);
  if (isNaN(amount)) return "";
  return amount.toFixed(4) + " EOS";
}

// Get a reference to an 'Eosjs' instance with a Scatter signature provider.
export var eosw = {
  eosScatter: null,
  eosKey: null,
  loginType: -1, // 0 - scatter, 1 - key, 2 - no key
  keyOptions: null,
  eos() {
    switch (this.loginType) {
      case 0:
        return this.eosScatter;
      case 1:
        return this.eosKey;
      default:
        return null;
    }
  },
  transfer(from, to, asset, memo) {
    switch (this.loginType) {
      case 0:
        return this.eosScatter.transfer(from, to, asset, memo);
      case 1:
        return this.eosKey.transfer(from, to, asset, memo, this.keyOptions);
      default:
        return null;
    }
  },
  delegatebw(from, to, net, cpu, transfer = 0) {
    switch (this.loginType) {
      case 0:
        return this.eosScatter.delegatebw(from, to, net, cpu, transfer);
      case 1:
        return this.eosKey.delegatebw(from, to, net, cpu, transfer);
      default:
        return null;
    }
  },
  addlink(id, uid) {
    switch (this.loginType) {
      case 0:
        this.eosScatter.contract(OFFICIALACCOUNTNAME).then(contract => {
          //console.log(contract)
          contract
            .addlink({ player: id, upplayer: uid }, { authorization: [id] })
            .then(result => {
              console.log(result);
              bus.$emit("eventLink", null);
            })
            .catch(error => {
              console.log("add link error:");
              console.log(error);
              console.log(typeof error);
              bus.$emit("eventLink", error);
            });
        });
        return;
      case 1:
        this.eosKey.contract(OFFICIALACCOUNTNAME).then(contract => {
          //console.log(contract)
          contract
            .addlink({ player: id, upplayer: uid }, { authorization: [id] })
            .then(result => {
              console.log(result);
              bus.$emit("eventLink", null);
            })
            .catch(error => {
              console.log("add link error:");
              console.log(error);
              console.log(typeof error);
              bus.$emit("eventLink", error);
            });
        });
        return;
      default:
        return null;
    }
  }
};
export default {
  name: "Login",
  components: {
    ProgressCircle,
    DialogScatter,
    DialogPrivateKey,
    DialogNoKey,
    ProgressBar
  },
  data() {
    return {
      isShowDialogScatter: false,
      isShowDialogPrivateKey: false,
      isShowDialogNoKey: false,
      tweenedEosBalance: 0,
      eosAccountName: "",
      eosBalance: "",
      eosAccounts: [],
      scatter: null,
      ramPct: 0,
      cpu_limit: null,
      net_limit: null
    };
  },
  watch: {
    eosBalance: function(newValue) {
      if (newValue)
        TweenLite.to(this.$data, 2, {
          tweenedEosBalance: newValue.substr(0, newValue.length - 4)
        });
    },
    eosAccountName: function(newValue) {
      this.$emit("event-login", newValue);
      this.getAccount();
      this.getCurrencyBalance();
      this.chkLink();
    }
  },
  computed: {
    isLogin: function() {
      return this.eosAccountName != "";
    },
    cpuPct: function() {
      if (!this.cpu_limit || this.cpu_limit.max < 0) return 0;
      // console.log("cpu pct: "+parseInt(this.cpu_limit.used/this.cpu_limit.max*100))
      // console.log(this.cpu_limit)
      return Math.min(
        parseInt(this.cpu_limit.used / this.cpu_limit.max * 100),
        100
      );
    },
    netPct: function() {
      if (!this.net_limit || this.net_limit.max < 0) return 0;
      return Math.min(
        parseInt(this.net_limit.used / this.net_limit.max * 100),
        100
      );
    }
  },
  methods: {
    pctColor(pct) {
      if (pct < 60) {
        return "#10b3f9";
      } else if (pct < 80) {
        return "#fcaa55";
      } else {
        return "#f23617";
      }
    },
    getIdentity() {
      if (this.scatter) {
        // You can require certain fields
        this.scatter
          .getIdentity(requiredFields)
          .then(identity => {
            //console.log(identity.accounts)
            sessionStorage.setItem("accountName", identity.accounts[0].name);
            sessionStorage.setItem("loginType", 0);
            this.initLogin();
          })
          .catch(error => {
            //...
            console.log("scatter get identity error:");
            console.log(error);
          });
      } else {
        this.isShowDialogScatter = true;
      }
    },
    eventKeyLogin(value) {
      //console.log(value)
      sessionStorage.setItem("accountName", value.accounts[0]);
      sessionStorage.setItem("eosAccounts", JSON.stringify(value.accounts));
      sessionStorage.setItem("priKey", value.key);
      sessionStorage.setItem("loginType", 1);
      this.initLogin();
    },
    eventNoKeyLogin(value) {
      //console.log(value)
      sessionStorage.setItem("accountName", value);
      sessionStorage.setItem("loginType", 2);
      this.initLogin();
    },
    chgAccount(account) {
      sessionStorage.setItem("accountName", account);
      this.initLogin();
    },
    getAccount() {
      if (!this.isLogin) return;
      eos
        .getAccount(this.eosAccountName)
        .then(account => {
          //console.log(account)
          this.cpu_limit = account.cpu_limit;
          this.net_limit = account.net_limit;
          this.ramPct =
            account.ram_quota <= 0
              ? 0
              : parseInt(account.ram_usage / account.ram_quota * 100);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCurrencyBalance() {
      if (!this.isLogin) return;
      eos
        .getCurrencyBalance("eosio.token", this.eosAccountName)
        .then(balance => {
          //console.log(balance)
          this.eosBalance = balance.length > 0 ? balance[0] : "0 EOS";
          //console.log(this.eosBalance)
        });
    },
    logout() {
      switch (eosw.loginType) {
        case 0:
          this.scatter.forgetIdentity().then(() => {
            console.log("logout");
            //console.log(this.scatter.identity)
          });
          break;
        case 1:
          this.eosAccounts = [];
          sessionStorage.setItem("eosAccounts", "");
          sessionStorage.setItem("priKey", "");
          break;
      }
      sessionStorage.setItem("accountName", "");
      sessionStorage.setItem("loginType", -1);
      this.eosAccountName = "";
      this.cpu_limit = null;
      this.net_limit = null;
      this.ramPct = 0;
    },
    chkLink() {
      if (!this.isLogin) return;
      if (!sessionStorage.getItem("upplayer")) return;
      // chk already linked
      eos
        .getTableRows(
          true,
          "eosshishicai",
          "eosshishicai",
          "link",
          "id",
          this.eosAccountName,
          Comm.NextAccountName(this.eosAccountName)
        )
        .then(result => {
          //console.log(result)
          // must check username is same
          if (
            result.rows.length > 0 &&
            result.rows[0].id == this.eosAccountName
          ) {
            // already linked
            console.log("already linked to: " + result.rows[0].uid);
            sessionStorage.removeItem("upplayer")
            this.$router.push("/");
          }
          //this.$refs.refResultList.newDatas(result.rows)
        })
        .catch(err => {
          console.log(err);
        });
    },
    initLogin() {
      eosw.loginType = parseInt(sessionStorage.getItem("loginType"));
      // is contract
      var account = sessionStorage.getItem("accountName");
      if (!account || account == "") return;
      eos
        .getAbi(account)
        .then(result => {
          if (result.abi) {
            // contract
            bus.$emit("eventContractLogin");
            this.logout();
            return;
          }
          if (eosw.loginType == 0) {
            // scatter login
            this.eosAccountName = sessionStorage.getItem("accountName");
          } else if (eosw.loginType == 1) {
            // key login
            this.eosAccountName = sessionStorage.getItem("accountName");
            this.eosAccounts = JSON.parse(
              sessionStorage.getItem("eosAccounts")
            );
            eosw.eosKey = Eos({
              httpEndpoint:
                EOSNETWORK.protocol +
                "://" +
                EOSNETWORK.host +
                ":" +
                EOSNETWORK.port,
              chainId: EOSNETWORK.chainId,
              keyProvider: sessionStorage.getItem("priKey")
            });
            eosw.keyOptions = {
              authorization: this.eosAccountName + "@active",
              broadcast: true,
              sign: true
            };
          } else if (eosw.loginType == 2) {
            // nokey login
            this.eosAccountName = sessionStorage.getItem("accountName");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.initLogin();
    //console.log("login type: "+eosw.loginType)
    document.addEventListener("scatterLoaded", scatterExtension => {
      // Scatter will now be available from the window scope.
      // At this stage the connection to Scatter from the application is
      // already encrypted.
      this.scatter = window.scatter;

      // It is good practice to take this off the window once you have
      // a reference to it.
      window.scatter = null;

      //...
      console.log("scatter loaded!");
      eosw.eosScatter = this.scatter.eos(EOSNETWORK, Eos, eosOptions);
      if (this.scatter != null && this.scatter.identity != null) {
        //this.eosAccountName = this.scatter.identity.accounts[0].name
        //eosw.loginType = 0
        /*
        this.scatter.getArbitrarySignature('public key', 'content', 'title', false).then(signature => {
          //...
          console.log(signature)
          // 
          console.log(ecc.sign("this is a test",'private key'))
          console.log(ecc.recover("SIG_K1_KbP38yDZxSaSWVD4QDwDHR6SGnLnNkiHvCNEBEPBgmmTikZdVbWFTmC3dXXpnLeqnQDoWomeC8ivh1Nnk8DYPvAVmaqSZn",'B is A"s child'))
          if(ecc.verify("SIG_K1_KbP38yDZxSaSWVD4QDwDHR6SGnLnNkiHvCNEBEPBgmmTikZdVbWFTmC3dXXpnLeqnQDoWomeC8ivh1Nnk8DYPvAVmaqSZn",
            'B is A"s child',"EOS8gdbm9ycZSvMbzA1tHohVPjXNTcZF96sGUcxCrbe7ikPdEN57v"))
            console.log("verify true")
          else
            console.log("verify false")

        }).catch(error => {
          //...
        })*/
      }
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loginDivMain {
  font-size: 13px;
  text-align: center;
  /* background: url(../assets/img/bg-user.png) 0 0 no-repeat; */
  width: 275px;
  height: 216px;
  display: flex;
  flex-direction: column;
}
.title {
  margin-top: 10px;
  margin-left: 10px;
  color: #eee;
  width: 80px;
  font-size: 18px;
  font-weight: bold;
}
.divLogin {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pctcircle {
  margin-left: 5px;
  margin-right: 8px;
}
.btLogin {
  margin-right: 10px;
  width: 236px;
  height: 52px;
  background: url(../assets/img/bg-login.png) center 0 no-repeat;
  background-size: 100% auto;
  font-size: 14px;
  line-height: 52px;
  font-weight: bold;
  text-shadow: 1px 1.732px 0px rgba(0, 0, 0, 0.29);
  text-align: center;
  color: #fff;
  outline: none;
  border: none;
}

.divInfo .divInfoRow {
  font-family: "微软雅黑", "Microsoft Yahei", "宋体", "Helvetica", "Arial",
    "simsun";
  color: #6fcbe7;
  font-size: 14px;
  line-height: 24px;
  font-weight: bold;
  margin-top: 10px;
  margin-left: 20px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 24px;
}
.divInfo .divInfoRow:first-child {
  margin-top: 20px;
}
.divInfo .divInfoRow.divInfoRowPct {
  height: 42px;
}
.divInfo .divInfoRow.divInfoRowPct i {
  cursor: pointer;
}
.bgcircle {
  text-align: center;
  width: 20px;
  height: 20px;
  line-height: 20px;
  color: #17315a;
  background: #6fcbe7;
  -moz-border-radius: 12px;
  -webkit-border-radius: 12px;
  border-radius: 12px;
}
.divInfo span {
  margin-left: 6px;
  width: 66px;
  text-align: left;
}
.divInfo strong {
  margin-left: 6px;
  color: #e5c25e;
  font-size: 16px;
}

.btLogout {
  display: block;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background-color: #1498ff;
  height: 32px;
  width: 226px;
  line-height: 32px;
  font-weight: bold;
  margin-top: 10px;
  outline: none;
  border: none;
}
.caretdown {
  color: #84cae4;
}
</style>



// WEBPACK FOOTER //
// src/components/Login.vue