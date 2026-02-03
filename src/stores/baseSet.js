import { ref } from 'vue';
import { defineStore } from 'pinia';
import queryString from 'query-string';
import axios from 'axios';

export const useBaseSet = defineStore('baseSet', () => {
  // State
  const config = ref({
    headers: {
      Accept: 'application/x-www-form-urlencoded',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const oauth = ref({
    grant_type: import.meta.env.VITE_API_GRANTTYPE,
    client_id: import.meta.env.VITE_API_CLINETID,
    client_secret: import.meta.env.VITE_API_CLIENTSECRET,
  });

  const apiUrl = import.meta.env.VITE_API_AUTH;

  const getConfigAuthToken = async () => {
    try {
      let configAuth = {};
      const res = await axios.post(
        apiUrl,
        queryString.stringify(oauth.value),
        config.value,
      );

      configAuth = {
        headers: {
          Authorization: `Bearer ${res.data.access_token}`,
        },
      };

      return configAuth;
    } catch (error) {
      console.log('getConfigAuthToken 錯誤 :', error.response);
    }
  };

  return { getConfigAuthToken };
});
