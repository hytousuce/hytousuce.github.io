let id = '5d69118e-6ebb-477c-b5db-e2d3be0e11e6';

let mainDom = document.getElementById('main');
let onLoadingDom = document.getElementById('onloading');
async function getUserData(id) {
  if (!id) return null;
  let url = 'https://habitica.com/api/v3/members/' + id;
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      resolve(xhr.responseText);
    });
    let errorCallback = () => {
      reject();
    };
    xhr.addEventListener('error', errorCallback);
    xhr.addEventListener('abort', errorCallback);
    xhr.addEventListener('timeout', errorCallback);
    xhr.open('get', url);
    xhr.send();
  });
}

function resolveData(data) {
  mainDom.classList.remove('hide');
  onLoadingDom.classList.add('hide');
  let avatarData = data.preferences;
  //// 处理头像背景
  let backgroundUrl =
    'https://habitica-assets.s3.amazonaws.com/mobileApp/images/background_' +
    avatarData.background +
    '.png';
  let avatarDom = document.getElementById('avatar');
  avatarDom.style.backgroundImage = "url('" + backgroundUrl + "')";
  //// 处理信息
  let authName = data.auth.local.username;
  let profileName = data.profile.name;
  let lvl = data.stats.lvl;
  let profileDom = document.getElementById('profile');
  let infoInnerHtml =
    '<h3 class="name">' +
    profileName +
    '</h3>' +
    '<div class="profile small-text"><span class="mr-1">@' +
    authName +
    '</span><span class="mr-1">·</span><span>等级' +
    lvl +
    '</span></div>';
  let infoDom = document.createElement('div');
  infoDom.innerHTML = infoInnerHtml;
  profileDom.appendChild(infoDom);
  // 处理数值信息
  // 生命条
  let maxHealth = data.stats.maxHealth;
  let health = data.stats.hp;
  let hpBarDom = document.getElementById('hp-bar');
  hpBarDom.style.width = (100 * health) / maxHealth + '%';
  hpBarDom.parentElement.parentElement.appendChild(
    document.createTextNode(health + '/' + maxHealth)
  );
  // 经验条
  let maxExp = data.stats.toNextLevel;
  let exp = data.stats.exp;
  let expBarDom = document.getElementById('exp-bar');
  expBarDom.style.width = (100 * exp) / maxExp + '%';
  expBarDom.parentElement.parentElement.appendChild(
    document.createTextNode(exp + '/' + maxExp)
  );
}
async function init() {
  let result = JSON.parse(await getUserData(id));
  if (result && result.success) {
    let data = result.data;
    resolveData(data);
  }
}

init();
