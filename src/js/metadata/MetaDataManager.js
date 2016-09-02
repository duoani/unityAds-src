/**
 * Created by duo on 2016/9/1.
 */
CMD.register("metadata.MetaDataManager", function (require) {
    var StorageType = require("storage.StorageType");
    var FrameworkMetaData = require("metadata.FrameworkMetaData");
    var AdapterMetaData = require("metadata.AdapterMetaData");
    var MediationMetaData = require("metadata.MediationMetaData");
    var PlayerMetaData = require("metadata.PlayerMetaData");

    function MetaDataManager() {
    }

    /**
     * �ӱ��ش洢���ȡָ�����͵Ķ��Ԫ����ֵ��
     * @param category      {String}        Ԫ��������
     * @param keys          {Array}         Ԫ���ݼ�ֵ���б�
     * @param nativeBridge  {NativeBridge}  Native Api
     * @returns Promise A+  {Promise}       {Array:values | undefined}
     */
    MetaDataManager.getValues = function (category, keys, nativeBridge) {
        return MetaDataManager.categoryExists(category, nativeBridge).then(function (exists) {
            if(exists){
                return Promise.all(keys.map(function (key) {
                    return nativeBridge.Storage.get(StorageType.PUBLIC, category + "." + key)["catch"](function () {});
                }));
            }else{
                return Promise.resolve(void 0);
            }
        });
    };
    MetaDataManager.fetchFrameworkMetaData = function (nativeBridge, useCache) {
        if(void 0 === useCache){
            useCache = true;
        }
        return MetaDataManager.fetch(FrameworkMetaData.getCategory(), FrameworkMetaData.getKeys(), nativeBridge, useCache).then(function (metaData) {
            return Promise.resolve(metaData);
        });
    };
    MetaDataManager.fetchAdapterMetaData = function (nativeBridge, useCache) {
        if(void 0 === useCache){
            useCache = true;
        }
        return MetaDataManager.fetch(AdapterMetaData.getCategory(), AdapterMetaData.getKeys(), nativeBridge, useCache).then(function (metaData) {
            return Promise.resolve(metaData);
        });
    };
    MetaDataManager.fetchMediationMetaData = function (nativeBridge, useCache) {
        if(void 0 === useCache){
            useCache = true;
        }
        return MetaDataManager.fetch(MediationMetaData.getCategory(), MediationMetaData.getKeys(), nativeBridge, useCache).then(function (metaData) {
            return Promise.resolve(metaData);
        });
    };
    MetaDataManager.fetchPlayerMetaData = function (nativeBridge) {
        return MetaDataManager.fetch(PlayerMetaData.getCategory(), PlayerMetaData.getKeys(), nativeBridge, false).then(function (metaData) {
            if(null != metaData){
                MetaDataManager.caches.player = void 0;
                return nativeBridge.Storage["delete"](StorageType.PUBLIC, PlayerMetaData.getCategory()).then(function () {
                    return metaData;
                });
            }else{
                return Promise.resolve(metaData);
            }
        });
    };
    /**
     * ͨ�ýӿڣ���ȡԪ����
     * @param category      {String}        Ԫ��������
     * @param keys          {Array}         Ԫ���ݼ�ֵ���б�
     * @param nativeBridge  {NativeBridge}  Native Api
     * @param useCache      {Boolean}       �Ƿ�ʹ�û��棬���Ϊtrue, ����ʹ�û������ݣ����ڵ�һ�λ�ȡԪ���ݵ�ͬʱ����������
     * @returns Promise A+  {Promise}       {MetaData | undefined}
     */
    MetaDataManager.fetch = function (category, keys, nativeBridge, useCache) {
        if(void 0 === useCache ){
            useCache = true;
        }
        if(useCache && MetaDataManager.caches[category]){
            return Promise.resolve(MetaDataManager.caches[category]);
        }else{
            return MetaDataManager.getValues(category, keys, nativeBridge).then(function (values) {
                return MetaDataManager.createAndCache(category, values, useCache);
            });
        }
    };
    MetaDataManager.createAndCache = function (category, values, useCache) {
        if(void 0 === useCache){
            useCache = true
        }
        if(void 0 !== values){
            if(useCache && !MetaDataManager.caches[category] ){
                MetaDataManager.caches[category] = MetaDataManager.createByCategory(category, values);
            }
            return useCache ? MetaDataManager.caches[category] : MetaDataManager.createByCategory(category, values)
        }else{
            return void 0
        }
    };
    MetaDataManager.createByCategory = function (category, values) {
        switch (category) {
            case "framework":
                return new FrameworkMetaData(values);

            case "adapter":
                return new AdapterMetaData(values);

            case "mediation":
                return new MediationMetaData(values);

            case "player":
                return new PlayerMetaData(values);

            default:
                return null;
        }
    };
    MetaDataManager.clearCaches = function () {
        MetaDataManager.caches = {
            framework: void 0,
            adapter: void 0,
            mediation: void 0,
            player: void 0
        };
    };
    MetaDataManager.categoryExists = function (category, nativeBridge) {
        return nativeBridge.Storage.getKeys(StorageType.PUBLIC, category, false).then(function (keys) {
            return keys.length > 0;
        });
    };
    MetaDataManager.caches = {
        framework: void 0,
        adapter: void 0,
        mediation: void 0,
        player: void 0
    };

    return MetaDataManager;
});