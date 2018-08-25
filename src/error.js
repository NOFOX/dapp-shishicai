import i18n from './i18n'
export default {

  GetErrorMsg:function (error) {
    switch(typeof(error)){
      case "object":
        // error from scatter
        switch(error.code){
          case 402:
            return i18n.t("denyError")
          case 9999:
            // myself error msg, code must be 9999, msg is lang title
            return i18n.t(error.msg)
        }
        break
      case "string":
        return this.GetEosErrorMsg(JSON.parse(error))
    }
    return i18n.t("unknownError")
  },
  GetEosErrorMsg:function (error) {
    if(!error||!error.code)
      return "";
    switch(error.code){
      case 500:
        // Internal Service Error
        if(!error.error||!error.error.code)
          return "";
        switch(error.error.code){
          case 3050003:
            // overdrawn balance
            var details = error.error.details
            if(!details||details.length<1||!details[0].message)
              return i18n.t("unknownError")
            if(details[0].message.indexOf("overdrawn balance")!= -1
              || details[0].message.indexOf("no balance object found")!= -1)
              return i18n.t("overdrawnBalance")
            if(details[0].message.indexOf("invalid betinfo")!= -1)
              return i18n.t("errorBetInfo")
            if(details[0].message.indexOf("must bet quantity in range")!= -1)
              return i18n.t("errorBetRange")+" (0.1 EOS - 100 EOS)"
            if(details[0].message.indexOf("out of bet limit")!= -1)
              return i18n.t("outOfBetLimit")
            if(details[0].message.indexOf("no allowed link self")!= -1)
              return i18n.t("errorLinkSelf")
            if(details[0].message.indexOf("already linked")!= -1)
              return i18n.t("errorLinkAlready")
            if(details[0].message.indexOf("upplayer does not exist")!= -1)
              return i18n.t("errorLinkNotexist")
            if(details[0].message.indexOf("insufficient staked net bandwidth")!= -1)
              return i18n.t("errorResNetNotEnough")
            return i18n.t("unknownError(500 - 3050003)")
          case 3080002:
            // overdrawn net 
            return i18n.t("outOfNetLimit")
          case 3080004:
            // overdrawn cpu
            return i18n.t("outOfCpuLimit")
          case 3090003:
            // unsatisfied authorization
            return i18n.t("unsatisfiedAuthorization")
          default:
            return i18n.t("unknownError(500 - "+error.error.code+")")
        }
        break;
      default:
        return i18n.t("unknownError("+error.code+")")
    }
  },
}
//{"code":500,"message":"Internal Service Error","error":{"code":3050003,"name":"eosio_assert_message_exception","what":"eosio_assert_message assertion failure","details":[{"message":"assertion failure with message: overdrawn balance","file":"wasm_interface.cpp","line_number":930,"method":"eosio_assert"},{"message":"pending console output: ","file":"apply_context.cpp","line_number":61,"method":"exec_one"}]}}
//{"code":500,"message":"Internal Service Error","error":{"code":3050003,"name":"eosio_assert_message_exception","what":"eosio_assert_message assertion failure","details":[{"message":"assertion failure with message: must bet quantity in range 0.1 EOS - 100 EOS","file":"wasm_interface.cpp","line_number":930,"method":"eosio_assert"},{"message":"pending console output: ","file":"apply_context.cpp","line_number":61,"method":"exec_one"}]}}
//{"code":500,"message":"Internal Service Error","error":{"code":3050003,"name":"eosio_assert_message_exception","what":"eosio_assert_message assertion failure","details":[{"message":"assertion failure with message: overdrawn balance","file":"wasm_interface.cpp","line_number":930,"method":"eosio_assert"},{"message":"pending console output: ","file":"apply_context.cpp","line_number":61,"method":"exec_one"}]}}



// WEBPACK FOOTER //
// ./src/error.js