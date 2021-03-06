import leanCloud from "./initiation";

export interface commentsItemType {
  OID: string;
  ID: number;
  identifier: string;
  name: string;
  content: string;
  date: Date;
  email: string;
  tag: string;
  replyList: commentsItemType[] | undefined;
  hasReplies: boolean;
  link: string;
}

const listFetcher = (config: nexmentConfigType) => {
  const AV = leanCloud(
    config.leancloud.appId,
    config.leancloud.appKey,
    config.leancloud.serverURL
  );
  /**
   *  Fetch comments data from the cloud
   *
   * @param {string | number} queryKey or replyID
   * @returns {Promise<commentsItemType[]>}
   */
  const ListGet = async (
    queryKey: string | number
  ): Promise<commentsItemType[]> => {
    // Maximum reply display depth 2
    const query = new AV.Query("nexment_comments");
    var combineData: commentsItemType[] = [];
    var repliesData: any[] = [];
    // querykey is of type string, querying identifier
    query.equalTo("identifier", queryKey);
    query.descending("createdAt");
    return await query.find().then(
      async (
        items: {
          /**
           * FIXME: a problem with Typescript union types usage
           * fix it later and as soon as possible
           */
          get: (arg0: string) => any;
          createdAt: Date;
          objectId: string;
        }[]
      ) => {
        // Store all reply data
        items.map(async (item) => {
          if (item.get("reply") !== undefined) {
            if (repliesData[item.get("reply").toString()] === undefined) {
              repliesData[item.get("reply").toString()] = [];
            }
            repliesData[item.get("reply").toString()].push({
              OID: item.get("objectId"),
              ID: item.get("ID"),
              identifier: item.get("identifier"),
              name: item.get("name"),
              content: item.get("content"),
              date: item.createdAt,
              email: item.get("email"),
              tag: item.get("tag"),
              link: item.get("link"),
              hasReplies: item.get("hasReplies"),
            });
          }
        });
        // Construct list structure
        items.map(async (item) => {
          if (
            (item.get("reply") === undefined && typeof queryKey === "string") ||
            typeof queryKey === "number"
          ) {
            // Get reply list recursively
            const repliesRecursion = (replyItemData: any[]) => {
              replyItemData.map((item) => {
                if (item.hasReplies) {
                  item["replyList"] = repliesRecursion(
                    repliesData[item.ID.toString()]
                  );
                }
              });
              return replyItemData.reverse();
            };
            // Get all corresponding replies of current comment
            let replyItemData: any[] | undefined = [];
            if (item.get("hasReplies")) {
              replyItemData = repliesData[item.get("ID").toString()];
              if (replyItemData) {
                replyItemData = repliesRecursion(replyItemData);
              }
            }
            const itemData = {
              OID: item.get("objectId"),
              ID: item.get("ID"),
              identifier: item.get("identifier"),
              name: item.get("name"),
              content: item.get("content"),
              date: item.createdAt,
              replyList: replyItemData,
              email: item.get("email"),
              tag: item.get("tag"),
              link: item.get("link"),
              hasReplies: item.get("hasReplies"),
            };
            combineData.push(itemData);
          }
        });
        return combineData;
      }
    );
  };
  return ListGet;
};

export default listFetcher;
