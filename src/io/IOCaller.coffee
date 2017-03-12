Error = require('../Error')
IOManager = require('./IOManager')
TokenChecker = require('./TokenChecker')



class IOCaller



IOCaller.call = (name, {data, token}) ->
  ioDefine = IOManager.dictIODefine[name]
  # 检查是否为公开IO
  if !ioDefine or ioDefine.public isnt true
    throw new Error.IO_NOT_FOUND({ioName: name})
  # 检查令牌
  token = TokenChecker.check(token, ioDefine)
  # 获取并调用IO
  io = IOManager.dictIO[name]
  ctx = {token}
  return await io.call(ctx, data)



module.exports = IOCaller