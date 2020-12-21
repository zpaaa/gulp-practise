#!/bin/sh

# ===============================================
# 此节内容需要用户修改
# 编译后对应的制品目录,若非"dist"目录需自行修改
# ===============================================
DIST_DIR="dist"
BUILD_ENV=$build_env

function check() {
  # 安装依赖
  yarn config set sass-binary-site "http://npm.taobao.org/mirrors/node-sass"
  yarn
}

function build() {
  # ===============================================
  # 此节内容需要用户修改
  # 构建环境，在网格中申请配置的部署环境，如：it0,it1,st0,st1,prod等
  # 需要自行定义不同环境对应的构建参数，需自行修改（注：实际名称以网格为主）
  # ===============================================

  if [ $BUILD_ENV = "st1" ]; then
    yarn build:st1
  else
    yarn build
  fi

  # 编译结果判断
  if [ $? != 0 ]; then
    echo "                                              "
    echo "##############################################"
    echo "Build failed !!!, Please check the console log"
    echo "##############################################"
    echo "                                              "
    exit 1
  fi
}


function package() {
  # 所有前端项目统一包名，在容器中也是统一的路径名：/opt/case/ued-web
  APP_PKG_NAME="ued-web"
  BASE_DIR=$(cd "$(dirname "$0")";pwd)

  # 清空打包目录
  [ -d "${BASE_DIR}/output_scm" ] && rm -rf "${BASE_DIR}/output_scm"
  mkdir -p "${BASE_DIR}/output_scm"

  # 打压缩包
  mv "${DIST_DIR}" "${BASE_DIR}/output_scm/${APP_PKG_NAME}"
  cd "${BASE_DIR}/output_scm"
  tar -zcf "${BASE_DIR}/output_scm/${APP_PKG_NAME}.tar.gz" "${APP_PKG_NAME}"

  # 计算包MD5
  md5sum "${BASE_DIR}/output_scm/${APP_PKG_NAME}.tar.gz" > "${BASE_DIR}/output_scm/${APP_PKG_NAME}.tar.gz.md5"
}

check
build
package
